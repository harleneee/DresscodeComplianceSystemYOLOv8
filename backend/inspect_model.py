from ultralytics import YOLO
model = YOLO("bestrobo.pt")
print("Classes:", model.names)
