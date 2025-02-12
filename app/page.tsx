"use client";

import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import Dashboard from './components/Dashboard';
import AuthPage from './AuthPage';
import Navbar from './components/Navbar';

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setShowAuth(false); // Hide auth modal when signed in
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div style={containerStyle}>
      <Navbar 
        onAuthClick={() => setShowAuth(true)}
        onAddContactClick={() => setShowAddContact(true)}
      />
      <div style={contentStyle}>
        {showAuth ? (
          <AuthPage onCloseAction={() => setShowAuth(false)} />
        ) : session ? (
          <Dashboard showAddContact={showAddContact} setShowAddContact={setShowAddContact} />
        ) : (
          <div style={welcomeStyle as React.CSSProperties}>
            <h1>Welcome to ProNet</h1>
            <p>Your Professional Network Management Tool</p>
            <button 
              onClick={() => setShowAuth(true)}
              style={buttonStyle}
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const containerStyle = {
  minHeight: '100vh',
  backgroundColor: '#1e1e1e',
  color: '#fff',
};

const contentStyle = {
  paddingTop: '64px', // Height of navbar
};

const welcomeStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  height: 'calc(100vh - 64px)',
  textAlign: 'center' as const,
  gap: '1rem',
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#0070f3',
  color: '#fff',
  fontSize: '1.1rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  marginTop: '1rem',
};
