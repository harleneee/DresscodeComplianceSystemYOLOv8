from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import base64
import json
import asyncio
from yolo_detector import YOLO_Detector
from rule_engine import RuleEngine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize detector and rules
detector = YOLO_Detector(model_path="bestrobo.pt")
rule_engine = RuleEngine()

@app.get("/api/status")
def get_status():
    return {"status": "running", "uptime": "ok"}

@app.get("/api/rules")
def get_rules():
    return rule_engine.get_rules()

@app.websocket("/ws/video-stream")
async def video_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive base64 image from frontend
            data = await websocket.receive_text()
            
            # Data usually starts with "data:image/jpeg;base64,"
            header, encoded = data.split(",", 1)
            image_data = base64.b64decode(encoded)
            
            # Convert to numpy array
            nparr = np.frombuffer(image_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is not None:
                # Flip the image horizontally so it acts like a mirror
                # This fixes the backward text issue since text is drawn AFTER flipping
                img = cv2.flip(img, 1)
                
                # Run YOLO detection
                detections, annotated_frame = detector.detect(img)
                
                # Apply Rules
                compliance_results = rule_engine.evaluate(detections)
                
                # Encode annotated frame
                _, buffer = cv2.imencode('.jpg', annotated_frame)
                annotated_b64 = base64.b64encode(buffer).decode('utf-8')
                
                # Prepare response
                response = {
                    "bboxes": detections,
                    "status": compliance_results["status"],
                    "flagged_items": compliance_results["flagged_items"],
                    "image": "data:image/jpeg;base64," + annotated_b64
                }
                
                # Send data back to frontend
                await websocket.send_text(json.dumps(response))
            
            # Small sleep to prevent tight loop overload
            await asyncio.sleep(0.01)
            
    except WebSocketDisconnect:
        print("Client disconnected from WebSocket")
        
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
