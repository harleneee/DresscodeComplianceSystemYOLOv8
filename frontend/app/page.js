"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', minHeight: 'calc(100vh - 70px)' }}>
      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: '#002855', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          UniFit Check
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
          AI-Powered Dress Code Compliance Dashboard
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <Link href="/scanner" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.5rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', height: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
               onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'; e.currentTarget.style.borderColor = '#00796b'; }}
               onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <div style={{ background: '#e6f4f1', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#00796b' }}>
               <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#002855', fontWeight: 'bold' }}>Live Scanner</h2>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              Access the real-time webcam feed with YOLOv8 object detection overlay for immediate compliance verification.
            </p>
          </div>
        </Link>

        <Link href="/verification" style={{ textDecoration: 'none', display: 'block' }}>
           <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.5rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', height: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
               onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'; e.currentTarget.style.borderColor = '#0ea5e9'; }}
               onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <div style={{ background: '#f0f9ff', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#0ea5e9' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#002855', fontWeight: 'bold' }}>Officer Verification</h2>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              Review flagged items and potential violations captured during uniform checks. 
            </p>
          </div>
        </Link>
        
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ background: '#f0fdf4', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#10b981' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#002855', fontWeight: 'bold' }}>Analytics Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#64748b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontWeight: '500' }}>Total Scans Today</span>
                    <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>1,245</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontWeight: '500' }}>Compliance Rate</span>
                    <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>94.2%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '500' }}>Pending Reviews</span>
                    <strong style={{ color: '#f59e0b', fontSize: '1.1rem' }}>12</strong>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
