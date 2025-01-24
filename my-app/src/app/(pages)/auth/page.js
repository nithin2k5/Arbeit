"use client";
import React, { useState } from 'react';
import './page.css';
import { useAuth } from "../../../context/AuthContext"
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, register, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace('/');
    } catch (err) {
      setError('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const email = e.target.email.value;
      const password = e.target.password.value;
      
      const response = await login(email, password);

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || 'Login failed');
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      toast.success('Login successful!');
      router.replace('/');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const email = e.target.email.value;
      const password = e.target.password.value;
      const confirmPassword = e.target.confirmPassword.value;

      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        setError('Passwords do not match');
        return;
      }

      const response = await register(email, password);
      

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || 'Registration failed');
        throw new Error(data.error || 'Registration failed');
      }

      toast.success('Account created successfully!');
      setIsLogin(true);
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="split-container">
        <div className="animated-side">
          <div className="absolute top-0 -z-10 h-full w-full bg-white">
            <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]"></div>
          </div>
          <div className="brand-content">
            <div className="logo">
              <span className="logo-main">Arbeit</span>
            </div>
            <div className="hero-text">
              <h1>
                <span className="text-gradient">Organize</span>
                <span className="text-gradient">Track</span>
                <span className="text-gradient">Succeed</span>
              </h1>
              <p className="hero-subtitle">Your journey to better productivity starts here</p>
            </div>
          </div>
        </div>

        <div className="auth-side">
          <div className="auth-card">
            <div className="auth-header">
              <h2 className="auth-title">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="auth-subtitle">
                {isLogin ? 'Let\'s get you back to being productive' : 'Join us and boost your productivity'}
              </p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button 
              className="google-auth-btn" 
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <Image 
                src="/google.svg" 
                alt="Google" 
                width={20} 
                height={20}
                priority
              />
              Continue with Google
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="auth-tabs">
              <button 
                className={`auth-tab ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
                type="button"
              >
                Login
              </button>
              <button 
                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
                type="button"
              >
                Sign Up
              </button>
            </div>

            <form className="auth-form" onSubmit={isLogin ? handleLogin : handleSignup}>
              {/* {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )} */}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                  />
                </div>
              )}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Loading...' : (isLogin ? 'Login' : 'Create Account')}
              </button>
            </form>

            <p className="auth-footer">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <button 
                    className="text-btn"
                    onClick={() => setIsLogin(false)}
                    type="button"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button 
                    className="text-btn"
                    onClick={() => setIsLogin(true)}
                    type="button"
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--background)',
            color: 'var(--text-color)',
            border: '1px solid var(--border-color)',
          },
          success: {
            iconTheme: {
              primary: 'var(--primary-color)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  );
} 