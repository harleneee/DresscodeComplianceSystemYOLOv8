export default function Verification() {
    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Officer Verification</h1>
            <p style={{ color: '#8b949e', marginBottom: '2rem' }}>Review captured evidence and classify flagged students.</p>
            
            <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#c9d1d9', marginBottom: '1rem' }}>No pending violations.</h2>
                <p style={{ color: '#8b949e' }}>The queue is currently empty. Run the scanner to generate mockup items.</p>
            </div>
        </div>
    )
}
