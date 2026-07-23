'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Zap, Lock, Mail, User as UserIcon } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || '';

    if (authMode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setAuthError('Passwords do not match');
        setAuthLoading(false);
        return;
      }

      try {
        let res = await fetch(`${BACKEND}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!res.ok && BACKEND === '') {
          // Fallback to local server port 5000 if running locally without environment var
          res = await fetch(`http://localhost:5000/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }),
          });
        }

        const data = await res.json();
        if (res.ok) {
          const userObj = { name: data.user?.name || formData.name, email: data.user?.email || formData.email };
          localStorage.setItem('user', JSON.stringify(userObj));
          if (data.token) localStorage.setItem('token', data.token);
          router.push('/dashboard');
        } else {
          setAuthError(data.error || 'Registration failed. Please try again.');
        }
      } catch (err) {
        setAuthError('Network error. Please check your internet connection.');
      }
    } else {
      try {
        let res = await fetch(`${BACKEND}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!res.ok && BACKEND === '') {
          // Fallback to local server port 5000 if running locally
          res = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });
        }

        const data = await res.json();
        if (res.ok) {
          const userObj = { name: data.user?.name || 'User', email: data.user?.email || formData.email };
          localStorage.setItem('user', JSON.stringify(userObj));
          if (data.token) localStorage.setItem('token', data.token);
          router.push('/dashboard');
        } else {
          setAuthError(data.error || 'Invalid credentials.');
        }
      } catch (err) {
        setAuthError('Network error. Please check your internet connection.');
      }
    }

    setAuthLoading(false);
  };

  return (
    <div className="auth-fullpage-wrapper">
      {/* Glow Background Effects */}
      <div className="auth-bg-glow glow-1"></div>
      <div className="auth-bg-glow glow-2"></div>

      <div className="auth-fullpage-card">
        {/* Left Branding Side - Visible on Desktop/Laptop */}
        <div className="auth-full-brand">
          <Link href="/" className="auth-back-link">
            <ArrowLeft size={18} /> Back to Website
          </Link>

          <div className="brand-logo-area">
            <svg width="42" height="42" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L29.8564 10V22L16 30L2.14359 22V10L16 2Z" fill="url(#auth-lg-grad)" stroke="#ff2c8c" strokeWidth="2" />
              <circle cx="16" cy="16" r="6" fill="#ffffff" />
              <defs>
                <linearGradient id="auth-lg-grad" x1="2" y1="2" x2="30" y2="30">
                  <stop stopColor="#3283ff" />
                  <stop offset="1" stopColor="#ff2c8c" />
                </linearGradient>
              </defs>
            </svg>
            <span className="brand-title-text">ICOLand</span>
          </div>

          <div className="brand-hero-content">
            <h2>Powering Data For The New Equity Blockchain.</h2>
            <p>Buy, sell, and track your cryptographic tokens in real-time with enterprise security and sub-second performance.</p>

            <div className="brand-feature-list">
              <div className="brand-feat-item">
                <ShieldCheck size={22} className="feat-ico" />
                <div>
                  <h4>Zero-Knowledge Security</h4>
                  <p>Bank-grade encryption protecting all wallet operations.</p>
                </div>
              </div>
              <div className="brand-feat-item">
                <Zap size={22} className="feat-ico" />
                <div>
                  <h4>Instant Token Rewards</h4>
                  <p>Earn daily staking APY directly in your dashboard.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="brand-footer-stats">
            <div className="stat-pill">
              <span className="stat-val">75% OFF</span>
              <span className="stat-lbl">Token Pre-Sale</span>
            </div>
            <div className="stat-pill">
              <span className="stat-val">50,000+</span>
              <span className="stat-lbl">Active Investors</span>
            </div>
          </div>
        </div>

        {/* Right Form Side - Desktop & Mobile */}
        <div className="auth-full-form">
          {/* Header Mobile Back Link */}
          <div className="mobile-top-nav">
            <Link href="/" className="auth-back-link">
              <ArrowLeft size={16} /> Home
            </Link>
          </div>

          <div className="form-inner-box">
            {/* Mode Switch Tabs */}
            <div className="auth-mode-switch">
              <button
                type="button"
                className={`switch-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`switch-tab ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
              >
                Sign Up
              </button>
            </div>

            <div className="form-header-text">
              <h2>{authMode === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>
              <p>
                {authMode === 'login'
                  ? 'Enter your credentials to access your ICO tokens & dashboard.'
                  : 'Register now to participate in our exclusive pre-sale rounds.'}
              </p>
            </div>

            {authError && <div className="auth-alert-error">{authError}</div>}

            <form onSubmit={handleSubmit} className="auth-form-fields">
              {authMode === 'register' && (
                <div className="field-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="field-input-wrapper">
                    <UserIcon size={18} className="field-icon" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Alex Morgan"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="field-group">
                <label htmlFor="email">Email Address</label>
                <div className="field-input-wrapper">
                  <Mail size={18} className="field-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="password">Password</label>
                <div className="field-input-wrapper">
                  <Lock size={18} className="field-icon" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div className="field-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="field-input-wrapper">
                    <Lock size={18} className="field-icon" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={authLoading}>
                {authLoading
                  ? (authMode === 'login' ? 'SIGNING IN...' : 'CREATING ACCOUNT...')
                  : (authMode === 'login' ? 'SIGN IN TO DASHBOARD' : 'REGISTER ACCOUNT')}
              </button>
            </form>

            <div className="auth-switch-prompt">
              {authMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }}>
                    Sign Up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }}>
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
