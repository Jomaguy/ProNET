"use client";

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import ContactForm from './ContactForm';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const [session, setSession] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    let error;
    if (isSignUp) {
      ({ error } = await supabase.auth.signUp({ email, password }));
      if (!error) setMessage('Sign up successful! Please check your email to confirm.');
    } else {
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
      if (!error) setMessage('Sign in successful!');
    }
    if (error) setMessage(`Error: ${error.message}`);
  };

  if (session) {
    return <ContactForm />;
  }

  return (
    <div style={authContainerStyle}>
      <form onSubmit={handleAuth} style={formStyle}>
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <p style={toggleStyle} onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </p>
        {message && <p style={messageStyle}>{message}</p>}
      </form>
    </div>
  );
}

const authContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#1e1e1e',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '20px',
  border: '1px solid #444',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  backgroundColor: '#2e2e2e',
  color: '#fff',
  maxWidth: '300px',
  width: '100%',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #555',
  fontSize: '16px',
  backgroundColor: '#3e3e3e',
  color: '#fff',
};

const buttonStyle = {
  padding: '10px 20px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#0070f3',
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const toggleStyle = {
  color: '#0070f3',
  cursor: 'pointer',
  textAlign: 'center',
};

const messageStyle = {
  color: '#fff',
  textAlign: 'center',
  marginTop: '10px',
};