"use client";

import ContactForm from '../ContactForm';
import ContactsList from './ContactsList';

interface DashboardProps {
  showAddContact: boolean;
  setShowAddContact: (show: boolean) => void;
}

export default function Dashboard({ showAddContact, setShowAddContact }: DashboardProps) {
  return (
    <div style={containerStyle}>
      {showAddContact && (
        <div style={overlayStyle} onClick={() => setShowAddContact(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <ContactForm onCloseAction={() => setShowAddContact(false)} />
          </div>
        </div>
      )}
      <ContactsList />
    </div>
  );
}

const containerStyle = {
  width: '100%',
  minHeight: '100vh',
  backgroundColor: '#1e1e1e',
};

const overlayStyle = {
  position: 'fixed' as const,
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
  padding: '1rem',
};

const modalStyle = {
  width: '100%',
  maxWidth: '700px',
  margin: '20px',
  backgroundColor: '#1e1e1e',
  borderRadius: '16px',
  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
  animation: 'modalFadeIn 0.3s ease-out',
  overflow: 'hidden',
}; 