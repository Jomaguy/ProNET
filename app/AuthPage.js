/* Mark this as a client-side component */
"use client";

/* Import necessary React hooks and components */
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import ContactForm from './ContactForm';

/* Main authentication component handling both sign-up and sign-in functionality */
export default function AuthPage() {
  /* State management for form inputs and UI control */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);  // Toggle between sign-up and sign-in modes
  const [message, setMessage] = useState('');       // Feedback messages for the user
  const [session, setSession] = useState(null);     // Store the user's session

  /* Set up authentication state listener */
  useEffect(() => {
    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    // Cleanup subscription on component unmount
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  /* Handle form submission for both sign-up and sign-in */
  const handleAuth = async (e) => {
    e.preventDefault();
    let error;
    if (isSignUp) {
      // Handle sign-up process
      ({ error } = await supabase.auth.signUp({ email, password }));
      if (!error) setMessage('Sign up successful! Please check your email to confirm.');
    } else {
      // Handle sign-in process
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
      if (!error) setMessage('Sign in successful!');
    }
    if (error) setMessage(`Error: ${error.message}`);
  };

  /* If user is authenticated, show the ContactForm component */
  if (session) {
    return <ContactForm />;
  }

  /* Render authentication form */
  return (
    <div style={authContainerStyle}>
      <form onSubmit={handleAuth} style={formStyle}>
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        {/* Email input field */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
        {/* Password input field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />
        {/* Submit button */}
        <button type="submit" style={buttonStyle}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        {/* Toggle between sign-up and sign-in modes */}
        <p style={toggleStyle} onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </p>
        {/* Display feedback messages */}
        {message && <p style={messageStyle}>{message}</p>}
      </form>
    </div>
  );
}

/* Styles for the authentication page */
const authContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#1e1e1e',  // Dark background for the container
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '20px',
  border: '1px solid #444',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  backgroundColor: '#2e2e2e',  // Slightly lighter background for the form
  color: '#fff',
  maxWidth: '300px',
  width: '100%',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #555',
  fontSize: '16px',
  backgroundColor: '#3e3e3e',  // Input field background
  color: '#fff',
};

const buttonStyle = {
  padding: '10px 20px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#0070f3',  // Blue accent color for the button
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const toggleStyle = {
  color: '#0070f3',  // Blue accent color for the toggle text
  cursor: 'pointer',
  textAlign: 'center',
};

const messageStyle = {
  color: '#fff',
  textAlign: 'center',
  marginTop: '10px',
};