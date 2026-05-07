import './globals.css';

export const metadata = {
  title: 'UniFit Check Scanner',
  description: 'AI-Powered Dress Code Compliance Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: '"Inter", sans-serif', background: '#eef2f6', color: '#0f172a' }}>
        <nav style={{ background: '#ffffff', padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <a href="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#00796b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                UniFit Check
            </a>
            <div style={{ display: 'flex', gap: '2rem', fontWeight: '500' }}>
                <a href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Dashboard</a>
                <a href="/scanner" style={{ color: '#64748b', textDecoration: 'none' }}>Scanner</a>
                <a href="/verification" style={{ color: '#64748b', textDecoration: 'none' }}>Verification</a>
            </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
