"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ProfileModal from './ProfileModal';

export default function Navbar({ onAuthClick, onAddContactClick }) {
  const [session, setSession] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <nav style={navStyle}>
        <div style={logoStyle}>ProNet</div>
        <div style={buttonGroupStyle}>
          {session && (
            <button onClick={onAddContactClick} style={buttonStyle}>
              Add Contact
            </button>
          )}
          {session ? (
            <button 
              onClick={() => setShowProfile(true)} 
              style={{
                ...buttonStyle,
                backgroundColor: 'transparent',
                border: '2px solid #0070f3',
              }}
            >
              Profile
            </button>
          ) : (
            <button onClick={() => onAuthClick()} style={buttonStyle}>
              Sign In
            </button>
          )}
        </div>
      </nav>
      
      {showProfile && (
        <div style={overlayStyle} onClick={() => setShowProfile(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <ProfileModal onCloseAction={() => setShowProfile(false)} />
          </div>
        </div>
      )}
    </>
  );
}

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  backgroundColor: '#2e2e2e',
  color: '#fff',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const logoStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#0070f3',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '1rem',
};

const buttonStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#0070f3',
  color: '#fff',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  animation: 'overlayFadeIn 0.2s ease-out',
};

const modalStyle = {
  width: '100%',
  maxWidth: '400px',
  margin: '20px',
  animation: 'modalFadeIn 0.3s ease-out',
}; 