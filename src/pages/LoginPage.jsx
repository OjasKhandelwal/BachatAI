import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Mail } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import './LoginPage.css';

// ─── Demo credentials ──────────────────────────────────────────
const DEMO_EMAIL    = 'demo@bachatai.com';
const DEMO_PASSWORD = 'Demo@1234';
// ───────────────────────────────────────────────────────────────

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Try demo@bachatai.com / Demo@1234');
        setLoading(false);
      }
    }, 600);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Google token:', tokenResponse);
      navigate('/dashboard');
    },
    onError: () => setError('Google sign-in failed. Please try again.'),
  });

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <div className="login-header">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Inline SVG path so we can colour it freely — no purple box */}
              <svg width="28" height="28" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
                  fill="#a78bfa"
                />
              </svg>
              <strong>BachatAI</strong>
            </Link>
          </div>

          <div className="login-form-area">
            <h1>Holla,<br/>Welcome Back</h1>
            <p className="subtitle">Hey, welcome back to your special place</p>

            {/* Google Sign-In */}
            <button className="btn-google" type="button" onClick={() => googleLogin()}>
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Sign in with Google
            </button>

            <div className="divider"><span>OR CONTINUE WITH EMAIL</span></div>

            {/* Demo credentials hint */}
            <div className="demo-hint">
              <span>Demo: <strong>demo@bachatai.com</strong> / <strong>Demo@1234</strong></span>
            </div>

            {/* Error message */}
            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>EMAIL</label>
                <div className="input-wrapper">
                  <Mail size={18} color="#9ca3af" className="input-icon" />
                  <input
                    type="email"
                    placeholder="demo@bachatai.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="label-row">
                  <label>PASSWORD</label>
                  <a href="#" className="forgot-link">FORGOT PASSWORD?</a>
                </div>
                <div className="input-wrapper">
                  <ShieldCheck size={18} color="#9ca3af" className="input-icon" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                  >
                    {showPass
                      ? <EyeOff size={18} color="#9ca3af" />
                      : <Eye size={18} color="#9ca3af" />
                    }
                  </button>
                </div>
              </div>

              <div className="remember-row">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>

              <button
                type="submit"
                className="btn-signin"
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign In to BachatAI'}
              </button>
            </form>
          </div>

          <div className="login-footer">
            <div className="footer-col">
              <strong>PLATFORM</strong>
              <a href="#">PRIVACY POLICY</a>
              <a href="#">TERMS OF SERVICE</a>
            </div>
            <div className="footer-col">
              <strong>RESOURCES</strong>
              <a href="#">RESOURCE CENTER</a>
              <a href="#">API DOCS</a>
            </div>
            <div className="footer-col">
              <strong>LEGAL</strong>
              <a href="#">FINANCIAL DISCLOSURE</a>
            </div>
          </div>
          <div className="copyright">© 2024 BACHATAI. ALL RIGHTS RESERVED.</div>
        </div>

        <div className="login-right">
          <div className="illustration-container">
            <img src="/login-image.png" alt="Login Illustration" className="login-illustration" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
