"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface ProfileModalProps {
  onCloseAction: () => void;
}

export default function ProfileModal({ onCloseAction }: ProfileModalProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUserProfile() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && user.email) {
        setUserEmail(user.email);
      }
      setIsLoading(false);
    }
    getUserProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onCloseAction();
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <p style={loadingStyle}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2>Profile</h2>
          <button type="button" onClick={onCloseAction} style={closeButtonStyle}>×</button>
        </div>
        
        <div style={contentStyle}>
          <div style={avatarStyle}>
            {userEmail?.[0]?.toUpperCase() || '?'}
          </div>
          
          <div style={infoStyle}>
            <h3 style={emailStyle}>{userEmail}</h3>
          </div>
          
          <button
            onClick={handleSignOut}
            style={signOutButtonStyle}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
};

const cardStyle = {
  width: '100%',
  maxWidth: '400px',
  backgroundColor: '#2e2e2e',
  borderRadius: '12px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  overflow: 'hidden',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.5rem',
  borderBottom: '1px solid #444',
  color: '#fff',
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#fff',
  fontSize: '28px',
  cursor: 'pointer',
  padding: '0.5rem',
  transition: 'color 0.3s',
  '&:hover': {
    color: '#ff4444',
  },
};

const contentStyle = {
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: '1.5rem',
};

const avatarStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: '#0070f3',
  color: '#fff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
};

const infoStyle = {
  textAlign: 'center' as const,
  color: '#fff',
};

const emailStyle = {
  fontSize: '1.1rem',
  margin: 0,
  color: '#fff',
};

const signOutButtonStyle = {
  width: '100%',
  padding: '1rem',
  borderRadius: '8px',
  border: '2px solid #ff4444',
  backgroundColor: 'transparent',
  color: '#ff4444',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginTop: '1rem',
  '&:hover': {
    backgroundColor: '#ff4444',
    color: '#fff',
  },
};

const loadingStyle = {
  padding: '2rem',
  textAlign: 'center' as const,
  color: '#fff',
}; 