"use client";
import React, { useState } from 'react';
import './page.css';
import Image from 'next/image';
import { useAuth } from "../../../context/AuthContext"
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const email = e.target.email.value;
      const password = e.target.password.value;
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          Username: email,
          Password: password
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      router.replace('/demo');
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
        setError('Passwords do not match');
        return;
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          Username: email,
          Password: password
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      setIsLogin(true);
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="background-grid" /> 
      <div className="split-container">
        <div className="animated-side">
          <div className="animated-circles">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
          </div>
          <div className="brand-content">
            <div className="logo">
              {/* <span className="logo-prefix">by ZeroOne CodeClub</span>
              <span className="logo-main">WorkSpace</span> */}
              <span className=" logo-main ">Arbeit</span>
              <span className="logo-prefix">by ZeroOne CodeClub</span>
            </div>
            <h1 className="animated-title">
              {/* <span className="gradient-text">Develop.</span>
              <span className="gradient-text">Collaborate.</span>
              <span className="gradient-text">Succeed.</span> */}
              <Image className="gradient-text" priority alt='job' src="./job.svg" width={100} height={100}></Image>
            </h1>
            <p className="animated-subtitle">Your journey to better productivity starts here</p>
          </div>
          <div className="animated-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
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
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )}

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
    </div>
  );
} 