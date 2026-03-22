import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await registerUser(form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.name);
      localStorage.setItem('userId', response.data.userId);
      navigate('/study');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={{...styles.blob, top: '-100px', right: '-100px', background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)'}} />
      <div style={{...styles.blob, bottom: '-150px', left: '-100px', background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)'}} />

      <div style={styles.container}>
        {/* Left Panel */}
        <div style={styles.leftPanel}>
          <div style={styles.brandMark}>
            <div style={styles.logoIcon}>
              <span style={{fontSize: '32px'}}>📚</span>
            </div>
            <h1 style={styles.brandName}>SmartStudy <span style={styles.brandAI}>AI</span></h1>
          </div>
          <p style={styles.tagline}>Your intelligent study companion</p>

          <div style={styles.statsGrid}>
            {[
              { icon: '📄', label: 'File Formats', value: '5+' },
              { icon: '🤖', label: 'AI Powered', value: '100%' },
              { icon: '✍️', label: 'Handwriting', value: 'OCR' },
              { icon: '🎯', label: 'Quiz Types', value: 'MCQ' },
            ].map((stat, i) => (
              <div key={i} style={styles.statCard}>
                <span style={styles.statIcon}>{stat.icon}</span>
                <span style={styles.statValue}>{stat.value}</span>
                <span style={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div style={styles.rightPanel}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Create account</h2>
              <p style={styles.formSubtitle}>Start your smart learning journey</p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>👤</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>✉</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                style={loading ? {...styles.submitBtn, opacity: 0.7} : styles.submitBtn}
                disabled={loading}
              >
                {loading ? '⟳ Creating account...' : 'Create Account →'}
              </button>
            </form>

            <p style={styles.switchText}>
              Already have an account?{' '}
              <Link to="/login" style={styles.switchLink}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  blob: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    opacity: 0.2,
    filter: 'blur(60px)',
    pointerEvents: 'none',
  },
  container: {
    display: 'flex',
    width: '900px',
    minHeight: '580px',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
    position: 'relative',
    zIndex: 1,
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandMark: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  logoIcon: {
    width: '52px',
    height: '52px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  brandName: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  brandAI: { color: '#a5b4fc' },
  tagline: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '15px',
    marginBottom: '40px',
    marginTop: '4px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  statCard: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statIcon: { fontSize: '20px' },
  statValue: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#a5b4fc',
  },
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
  },
  rightPanel: {
    flex: 1,
    background: '#0f0f17',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 40px',
  },
  formCard: {
    width: '100%',
    maxWidth: '360px',
  },
  formHeader: { marginBottom: '28px' },
  formTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 6px',
    letterSpacing: '-0.5px',
  },
  formSubtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '14px',
    margin: 0,
  },
  errorBox: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#fca5a5',
    fontSize: '13px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '13px',
    fontWeight: '500',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    fontSize: '14px',
    opacity: 0.4,
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 14px 12px 40px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '24px',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '14px',
  },
  switchLink: {
    color: '#a5b4fc',
    textDecoration: 'none',
    fontWeight: '500',
  },
};
