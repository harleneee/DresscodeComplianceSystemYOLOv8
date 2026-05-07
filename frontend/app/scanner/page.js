"use client";

import { useEffect, useRef, useState } from 'react';

export default function Scanner() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const wsRef = useRef(null);
    const [status, setStatus] = useState("Initializing...");
    const [flaggedItems, setFlaggedItems] = useState([]);
    const [annotatedImage, setAnnotatedImage] = useState(null);

    useEffect(() => {
        // Initialize WebSocket
        try {
            wsRef.current = new WebSocket('ws://localhost:8000/ws/video-stream');
            
            wsRef.current.onopen = () => {
                console.log("WebSocket connected");
            };

            wsRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setStatus(data.status);
                setFlaggedItems(data.flagged_items);

                if (data.image) {
                    setAnnotatedImage(data.image);
                }
                
                // Request next frame only after processing current one to prevent lag
                requestAnimationFrame(captureFrame);
            };

            wsRef.current.onerror = (error) => {
                console.error("WebSocket error", error);
                setStatus("WebSocket Error");
            };

            wsRef.current.onclose = () => {
                console.log("WebSocket disconnected");
                setStatus("Disconnected");
            };
        } catch (e) {
            console.error(e);
        }

        // Initialize Camera
        startCamera();

        return () => {
            if (wsRef.current) wsRef.current.close();
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    captureFrame();
                };
            }
            
        } catch (err) {
            console.error("Error accessing camera:", err);
            setStatus("Camera Access Denied");
        }
    };

    const captureFrame = () => {
        if (!videoRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const video = videoRef.current;
        // Create an offscreen canvas to capture the image
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
        if(wsRef.current.readyState === WebSocket.OPEN) {
             wsRef.current.send(dataUrl);
        }
    };

    const drawBoxes = (bboxes) => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        // Ensure canvas dimensions match video display dimensions
        if (canvas.width !== video.clientWidth) canvas.width = video.clientWidth;
        if (canvas.height !== video.clientHeight) canvas.height = video.clientHeight;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate scaling if video display size differs from native resolution
        const scaleX = canvas.width / (video.videoWidth || 640);
        const scaleY = canvas.height / (video.videoHeight || 480);

        bboxes.forEach(box => {
            const x = box.x1 * scaleX;
            const y = box.y1 * scaleY;
            const width = (box.x2 - box.x1) * scaleX;
            const height = (box.y2 - box.y1) * scaleY;

            const isViolation = status.includes("Violation");
            const boxColor = isViolation ? '#ef4444' : '#00796b';

            // Draw bounding box
            ctx.strokeStyle = boxColor;
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);

            // Draw label background
            const label = `${box.label} (${(box.confidence * 100).toFixed(1)}%)`;
            ctx.fillStyle = boxColor;
            const textWidth = ctx.measureText(label).width;
            ctx.fillRect(x, y - 28, textWidth + 16, 28);

            // Draw label text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px "Inter", sans-serif';
            ctx.fillText(label, x + 8, y - 8);
        });
    };

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', background: '#eef2f6', fontFamily: '"Inter", sans-serif', color: '#0f172a' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#002855' }}>Welcome back, Officer :)</h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.25rem' }}>Let's tackle today's compliance checks together</p>
                </div>

                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    {/* Camera Feed Card */}
                    <div style={{ position: 'relative', flex: '1 1 640px', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                            <h2 style={{ fontSize: '1.15rem', fontWeight: '600', color: '#002855' }}>Live Camera Feed</h2>
                        </div>
                        <div style={{ position: 'relative', background: '#000', flexGrow: 1 }}>
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                muted 
                                style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} 
                            />
                            {annotatedImage && (
                                <img 
                                    src={annotatedImage} 
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} 
                                />
                            )}
                            <canvas 
                                ref={canvasRef} 
                                style={{ display: 'none' }} 
                            />
                        </div>
                    </div>

                    {/* Right Panel Cards */}
                    <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            {/* Status Card */}
                            <div style={{ 
                                flex: 1,
                                background: '#ffffff', 
                                padding: '1.5rem', 
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                border: '1px solid #e2e8f0',
                                position: 'relative'
                            }}>
                                <h2 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '1rem' }}>CURRENT STATUS</h2>
                                <div style={{ 
                                    fontSize: '2rem', 
                                    fontWeight: 'bold',
                                    color: status.includes("Violation") ? '#ef4444' : status.includes("Compliant") ? '#00796b' : '#002855'
                                }}>
                                    {status}
                                </div>
                            </div>
                        </div>

                        {/* Flagged Items Card */}
                        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                             <h2 style={{ fontSize: '1.15rem', fontWeight: '600', color: '#002855', marginBottom: '1rem' }}>Flagged Items</h2>
                             {flaggedItems.length > 0 ? (
                                 <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                     {flaggedItems.map((item, i) => (
                                         <li key={i} style={{ background: '#fef2f2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
                                            {item}
                                         </li>
                                     ))}
                                 </ul>
                             ) : (
                                 <div style={{ color: '#00796b', padding: '0.5rem 0', fontWeight: '500' }}>
                                     No violations detected.
                                 </div>
                             )}
                        </div>

                        {/* Controls Container matching the "Academic Profile" look from image */}
                        <div style={{ marginTop: 'auto' }}>
                            <h2 style={{ fontSize: '1.15rem', fontWeight: '600', color: '#002855', marginBottom: '1rem' }}>Scanner Services</h2>
                            <div style={{ background: '#00796b', padding: '2rem 1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: 'white', position: 'relative', overflow: 'hidden' }}>
                                {/* Decorative elements */}
                                <div style={{ position: 'absolute', top: '-40px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}></div>
                                <div style={{ position: 'absolute', bottom: '-20px', right: '-40px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}></div>
                                
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                </div>
                                
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', position: 'relative' }}>Submit Violation Report</h3>
                                
                                <button style={{ 
                                    background: '#ffffff', 
                                    color: '#00796b', 
                                    border: 'none', 
                                    padding: '0.6rem 1.25rem', 
                                    borderRadius: '8px', 
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    transition: 'background 0.2s',
                                    position: 'relative'
                                }}>
                                    Capture & Report
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
