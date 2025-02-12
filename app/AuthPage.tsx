/* Mark this as a client-side component */
"use client";

/* Import necessary React hooks and components */
import { useState, FormEvent, MouseEvent } from 'react';
import { supabase } from './supabaseClient';

interface AuthPageProps {
  onCloseAction: () => void;
}

/* Main authentication component handling both sign-up and sign-in functionality */
export default function AuthPage({ onCloseAction }: AuthPageProps) {
  /* State management for form inputs and UI control */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);  // Toggle between sign-up and sign-in modes
  const [message, setMessage] = useState('');       // Feedback messages for the user
  const [isLoading, setIsLoading] = useState(false); // Loading state for the form

  /* Handle form submission for both sign-up and sign-in */
  const handleAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      let error;
      if (isSignUp) {
        // Handle sign-up process
        ({ error } = await supabase.auth.signUp({ email, password }));
        if (!error) setMessage('Sign up successful! Please check your email to confirm.');
      } else {
        // Handle sign-in process
        ({ error } = await supabase.auth.signInWithPassword({ email, password }));
        if (!error) {
          setMessage('Sign in successful!');
          // Close the modal after successful sign in
          setTimeout(() => onCloseAction(), 1000);
        }
      }
      if (error) setMessage(`Error: ${error.message}`);
    } catch (err) {
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /* Handle clicking outside the modal to close it */
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCloseAction();
    }
  };

  /* Render authentication form */
  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={authContainerStyle}>
        <form onSubmit={handleAuth} style={formStyle}>
          <div style={headerStyle}>
            <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
            <button type="button" onClick={onCloseAction} style={closeButtonStyle}>×</button>
          </div>
          
          {/* Email input field */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
            disabled={isLoading}
          />
          {/* Password input field */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
            disabled={isLoading}
          />
          {/* Submit button */}
          <button 
            type="submit" 
            style={{
              ...buttonStyle,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
          {/* Toggle between sign-up and sign-in modes */}
          <p style={toggleStyle} onClick={() => !isLoading && setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </p>
          {/* Display feedback messages */}
          {message && <p style={{
            ...messageStyle,
            backgroundColor: message.includes('Error') ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)'
          }}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

/* Styles for the authentication page */
const authContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '15px',
  padding: '30px',
  border: '1px solid #444',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  backgroundColor: '#2e2e2e',
  color: '#fff',
  maxWidth: '400px',
  width: '100%',
};

const inputStyle = {
  padding: '12px',
  borderRadius: '4px',
  border: '1px solid #555',
  fontSize: '16px',
  backgroundColor: '#3e3e3e',
  color: '#fff',
  width: '100%',
  boxSizing: 'border-box' as const,
};

const buttonStyle = {
  padding: '12px 20px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#0070f3',
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  width: '100%',
};

const toggleStyle = {
  color: '#0070f3',
  cursor: 'pointer',
  textAlign: 'center' as const,
  marginTop: '10px',
};

const messageStyle = {
  color: '#fff',
  textAlign: 'center' as const,
  marginTop: '10px',
  padding: '10px',
  borderRadius: '4px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#fff',
  fontSize: '24px',
  cursor: 'pointer',
  padding: '0 5px',
};