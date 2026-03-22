import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await loginUser(form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.name);
      localStorage.setItem('userId', response.data.userId);
      navigate('/study');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Animated background blobs */}
      <div style={{...styles.blob, top: '-100px', left: '-100px', background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)'}} />
      <div style={{...styles.blob, bottom: '-150px', right: '-100px', background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)'}} />
      <div style={{...styles.blob, top: '40%', right: '20%', width: '300px', height: '300px', background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', opacity: 0.15}} />

      <div style={styles.container}>
        {/* Left Panel */}
        <div style={styles.leftPanel}>
          <div style={styles.brandMark}>
            <div style={styles.logoIcon}>
              <span style={{fontSize: '32px'}}>📚</span>
            </div>
            <h1 style={styles.brandName}>SmartStudy <span style={styles.brandAI}>AI</span></h1>
          </div>
          <p style={styles.tagline}>Transform your notes into knowledge</p>
          <div style={styles.featureList}>
            {['Upload any document — PDF, Word, Excel, Images', 'AI-powered summaries in seconds', 'Auto-generated quizzes to test yourself', 'Supports handwritten notes via OCR'].map((f, i) => (
              <div key={i} style={styles.featureItem}>
                <span style={styles.featureDot}>✦</span>
                <span style={styles.featureText}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div style={styles.rightPanel}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Welcome back</h2>
              <p style={styles.formSubtitle}>Sign in to continue learning</p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
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
                {loading ? (
                  <span style={styles.loadingText}>
                    <span style={styles.spinner}>⟳</span> Signing in...
                  </span>
                ) : 'Sign In →'}
              </button>
            </form>

            <p style={styles.switchText}>
              Don't have an account?{' '}
              <Link to="/register" style={styles.switchLink}>Create one free</Link>
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
    minHeight: '560px',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
    position: 'relative',
    zIndex: 1,
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
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
  brandAI: {
    color: '#a5b4fc',
  },
  tagline: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '15px',
    marginBottom: '40px',
    marginTop: '4px',
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  featureDot: {
    color: '#a5b4fc',
    fontSize: '12px',
    marginTop: '2px',
    flexShrink: 0,
  },
  featureText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '14px',
    lineHeight: '1.5',
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
  formHeader: {
    marginBottom: '32px',
  },
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
    gap: '20px',
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
    letterSpacing: '0.3px',
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
    transition: 'border-color 0.2s',
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
    letterSpacing: '0.3px',
    transition: 'opacity 0.2s, transform 0.1s',
  },
  loadingText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
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
