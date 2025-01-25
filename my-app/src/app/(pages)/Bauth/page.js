"use client"

import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import BusinessNetwork from '@/app/components/Globe/Globe';
import './page.css';

const Bauthen = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  
  // Initialize all form input states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    companyEmail: '',
    companyName: '',
    otp: '',
    loginEmail: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError('');
  };

  const handleVerification = async () => {
    if (!formData.companyEmail) {
      toast.error('Please enter company email');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.companyEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setShowOTP(true);
      toast.success('Verification code sent to your email');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!formData.otp) {
      toast.error('Please enter OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/auth/verify-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.companyEmail,
          code: formData.otp
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      setVerified(true);
      setShowOTP(false);
      toast.success('Email verified successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSignUp) {
      if (!verified) {
        toast.error('Please verify your company email first');
        return;
      }

      // Validate required fields
      if (!formData.name || !formData.email || !formData.companyName || 
          !formData.address || !formData.companyEmail || !formData.password) {
        toast.error('Please fill in all required fields');
        return;
      }

      try {
        setLoading(true);
        
        // Proceed with registration directly since OTP is already verified
        const response = await fetch('/api/auth/business/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            companyName: formData.companyName,
            address: formData.address,
            companyEmail: formData.companyEmail,
            password: formData.password,
            otp: formData.otp
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        toast.success(`Registration successful! Your Business ID is: ${data.bid}`);
        
        // Clear form data
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          companyEmail: '',
          companyName: '',
          otp: '',
          loginEmail: '',
          password: ''
        });
        
        // Reset states
        setVerified(false);
        setShowOTP(false);
        
        // Switch to login after a short delay
        setTimeout(() => {
          setIsSignUp(false);
        }, 1500);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      if (!formData.loginEmail) {
        toast.error('Please enter your company email');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/auth/business/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.loginEmail,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }

        toast.success('Login successful! Redirecting to business dashboard...');
        setTimeout(() => {
          window.location.href = '/business';
        }, 1000);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="page-container">
      <Toaster position="top-right" />
      <div className="outer-container">
        <div className="auth-container">
          <div className="auth-image">
            <BusinessNetwork />
          </div>
          <div className="auth-card">
            <h2>{isSignUp ? 'Register Your Business' : 'Business Login'}</h2>
            <p>{isSignUp 
              ? 'Create your business account to start posting jobs' 
              : 'Login to manage your jobs and applications'}
            </p>
            <div className="toggle-buttons">
              <button 
                onClick={() => setIsSignUp(false)} 
                className={!isSignUp ? 'active' : ''}
                disabled={loading}
              >
                Business Login
              </button>
              <button 
                onClick={() => setIsSignUp(true)} 
                className={isSignUp ? 'active' : ''}
                disabled={loading}
              >
                Register Business
              </button>
            </div>
            {isSignUp ? (
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input 
                    type="text" 
                    id="name" 
                    placeholder=" " 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                    disabled={loading}
                  />
                  <label htmlFor="name">Name</label>
                </div>
                <div className="input-group">
                  <input 
                    type="email" 
                    id="email" 
                    placeholder=" " 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                    disabled={loading}
                  />
                  <label htmlFor="email">Mail</label>
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    id="companyName" 
                    placeholder=" " 
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required 
                    disabled={loading}
                  />
                  <label htmlFor="companyName">Company Name</label>
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    id="address" 
                    placeholder=" " 
                    value={formData.address}
                    onChange={handleInputChange}
                    required 
                    disabled={loading}
                  />
                  <label htmlFor="address">Address</label>
                </div>
                {!verified ? (
                  <>
                    <div className="input-group">
                      <input 
                        type="email" 
                        id="companyEmail"
                        placeholder=" "
                        value={formData.companyEmail}
                        onChange={handleInputChange}
                        required 
                        disabled={loading || showOTP}
                      />
                      <label htmlFor="companyEmail">Company Mail</label>
                    </div>
                    {!showOTP && (
                      <button 
                        type="button"
                        className="verify-button"
                        onClick={handleVerification}
                        disabled={loading}
                      >
                        {loading ? 'Sending...' : 'Send OTP'}
                      </button>
                    )}
                    {showOTP && (
                      <div className="input-group">
                        <input 
                          type="text" 
                          id="otp" 
                          placeholder=" " 
                          value={formData.otp}
                          onChange={handleInputChange}
                          required 
                          disabled={loading}
                        />
                        <label htmlFor="otp">Enter OTP</label>
                        <button 
                          type="button"
                          className="verify-button"
                          onClick={handleOTPVerification}
                          disabled={loading}
                        >
                          {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="input-group">
                      <input 
                        type="email" 
                        id="companyEmail"
                        placeholder=" "
                        value={formData.companyEmail}
                        disabled
                        className="disabled-input"
                      />
                      <label htmlFor="companyEmail">Company Mail</label>
                      <button 
                        type="button"
                        className="reset-button"
                        onClick={() => {
                          setVerified(false);
                          setShowOTP(false);
                          setFormData(prev => ({...prev, companyEmail: '', otp: ''}));
                        }}
                        disabled={loading}
                      >
                        Reset
                      </button>
                    </div>
                    <div className="input-group">
                      <input 
                        type="password" 
                        id="password"
                        placeholder=" "
                        value={formData.password}
                        onChange={handleInputChange}
                        required 
                        disabled={loading}
                      />
                      <label htmlFor="password">Password</label>
                    </div>
                  </>
                )}
                <button type="submit" disabled={loading || !verified}>
                  {loading ? 'Processing...' : 'Sign Up'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input 
                    type="email" 
                    id="loginEmail" 
                    placeholder=" " 
                    value={formData.loginEmail}
                    onChange={handleInputChange}
                    required 
                    disabled={loading}
                  />
                  <label htmlFor="loginEmail">Company Email</label>
                </div>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder=" "
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <div className="show-password">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  />
                  <label>Show Password</label>
                </div>
                <p className="login-note">
                  Looking to apply for jobs? <a href="/auth">Click here</a> to go to the job seeker login.
                </p>
                <button type="submit" disabled={loading}>
                  {loading ? 'Processing...' : 'Sign In to Business Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bauthen;
