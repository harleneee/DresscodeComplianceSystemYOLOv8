# Dress Code Compliance System (YOLOv8)

A real-time, computer vision-based web application designed to automatically enforce university dress code policies. Powered by a custom-trained YOLOv8 object detection model, this system actively scans live camera feeds to identify student attire and verifies compliance based on a strict, schedule-aware rule engine.

## Features

- **Real-Time Object Detection**: Uses a custom-trained YOLOv8 model (`bestrobo.pt`) to detect 14 specific classes of clothing (e.g., `uniform_top`, `jeans`, `cropped_top`, `closed_shoes`).
- **Schedule-Aware Rule Engine**: Automatically enforces different dress code rules depending on the day of the week:
  - **Uniform Days (Mon, Tue, Thu)**: Strictly requires a `uniform_top`, `uniform_bottom`, and `closed_shoes`.
  - **Civilian Days (Wed, Fri, Sat, Sun)**: Permits civilian attire like `tshirt` and `jeans`, while strictly flagging inappropriate clothing.
- **Universal Violation Tracking**: Instantly flags universally prohibited items (e.g., `slippers`, `mini_skirt`, `ripped_jeans`) regardless of the day.
- **Temporal Smoothing**: Implements a history buffer algorithm to eliminate UI flickering and prevent false positives from momentary model misclassifications.
- **WebSocket Backpressure Control**: Features an asynchronous request-response video streaming loop, completely eliminating camera latency and lag.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: FastAPI, Uvicorn, Python
- **AI/ML**: Ultralytics YOLOv8, OpenCV, NumPy

## Setup & Installation

### 1. Backend Setup
Navigate to the backend directory and install the necessary Python dependencies.
```bash
cd backend
python -m venv venv
# Activate the virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Frontend Setup
Navigate to the frontend directory and install the Node modules.
```bash
cd frontend
npm install
```

## How to Run

To run the application, you need to start both the backend server and the frontend application simultaneously in two separate terminal windows.

### Terminal 1: Start the Backend
```bash
cd backend
.\venv\Scripts\activate
python main.py
```
*(The backend will run on `http://localhost:8000`)*

### Terminal 2: Start the Frontend
```bash
cd frontend
npm run dev
```
*(The frontend will run on `http://localhost:3000`)*

Once both servers are running smoothly, open your web browser and navigate to **[http://localhost:3000](http://localhost:3000)** to access the live scanner dashboard.
