import cv2
from ultralytics import YOLO

class YOLO_Detector:
    def __init__(self, model_path="bestrobo.pt"):
        # We only need the custom model now.
        # It natively predicts top and bottom boxes perfectly.
        self.clothes_model = YOLO(model_path)
        print(f"Loaded model: {model_path}")
        
    def detect(self, frame):
        clothes_results = self.clothes_model(frame, verbose=False)
        annotated_frame = frame.copy()
        detections = []
        
        frame_h, frame_w = frame.shape[:2]
        frame_area = frame_h * frame_w
        
        if len(clothes_results) > 0:
            for box in clothes_results[0].boxes:
                conf = box.conf[0].item()
                if conf > 0.35: # confidence threshold
                    cls_id = int(box.cls[0].item())
                    label = self.clothes_model.names[cls_id]
                    
                    x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                    
                    detections.append({
                        "label": label,
                        "confidence": conf,
                        "x1": x1,
                        "y1": y1,
                        "x2": x2,
                        "y2": y2
                    })
                    
                    # Prevent drawing full-screen boxes (like the closed_shoes bug)
                    box_area = (x2 - x1) * (y2 - y1)
                    if box_area > 0.85 * frame_area:
                        continue # Skip drawing huge boxes, but still keep in detections for the Rule Engine!
                    
                    # Assign colors based on top/bottom/shoes
                    if label in ['uniform_top', 'tshirt', 'blouse_deepneckline', 'cropped_top', 'sleeveless_top']:
                        color = (255, 0, 0) # Blue
                    elif label in ['uniform_bottom', 'jeans', 'business_shorts', 'unprescribed_shorts', 'ripped_jeans', 'leggings', 'mini_skirt']:
                        color = (0, 255, 255) # Yellow
                    else:
                        color = (0, 165, 255) # Orange
                        
                    # Draw actual bounding box predicted by your custom model!
                    cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), color, 3)
                    
                    # Draw Label
                    label_text = f"{label} {conf:.2f}"
                    (text_w, text_h), _ = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                    
                    bg_y1 = y1 - 25 if y1 - 25 > 0 else y1
                    bg_y2 = y1 if y1 - 25 > 0 else y1 + 25
                    text_y = y1 - 5 if y1 - 25 > 0 else y1 + 20
                    
                    cv2.rectangle(annotated_frame, (x1, bg_y1), (x1 + text_w, bg_y2), color, -1)
                    cv2.putText(annotated_frame, label_text, (x1, text_y), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)

        return detections, annotated_frame
