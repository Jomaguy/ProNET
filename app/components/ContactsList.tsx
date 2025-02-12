"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import EditContactModal from './EditContactModal';

interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  job_title: string;
  company: string;
  linkedin: string;
  notes: string;
  tags: string[];
  last_contacted: string;
  created_at: string;
}

export default function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be logged in to view contacts');
        return;
      }

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div style={loadingStyle}>
        Loading contacts...
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorStyle}>
        {error}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Your Contacts</h2>
      {contacts.length === 0 ? (
        <p style={emptyStyle}>No contacts found. Add some contacts to get started!</p>
      ) : (
        <div style={gridStyle}>
          {contacts.map((contact) => (
            <div key={contact.id} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={nameStyle}>{contact.full_name}</h3>
                <button 
                  onClick={() => setEditingContact(contact)}
                  style={editButtonStyle}
                >
                  Edit
                </button>
              </div>
              {contact.job_title && contact.company && (
                <p style={subtitleStyle}>{contact.job_title} at {contact.company}</p>
              )}
              {contact.email && (
                <p style={detailStyle}>
                  <strong>Email:</strong> {contact.email}
                </p>
              )}
              {contact.phone_number && (
                <p style={detailStyle}>
                  <strong>Phone:</strong> {contact.phone_number}
                </p>
              )}
              {contact.tags && contact.tags.length > 0 && (
                <div style={tagsContainerStyle}>
                  {contact.tags.map((tag, index) => (
                    <span key={index} style={tagStyle}>{tag}</span>
                  ))}
                </div>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" style={linkedinStyle}>
                  LinkedIn Profile
                </a>
              )}
              {contact.notes && (
                <p style={notesStyle}>{contact.notes}</p>
              )}
              <p style={dateStyle}>
                Added: {new Date(contact.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
      
      {editingContact && (
        <div style={overlayStyle} onClick={() => setEditingContact(null)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <EditContactModal 
              contact={editingContact}
              onCloseAction={() => setEditingContact(null)}
              onContactUpdated={fetchContacts}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
};

const headerStyle = {
  color: '#fff',
  marginBottom: '2rem',
  textAlign: 'center' as const,
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '1.5rem',
};

const cardStyle = {
  backgroundColor: '#2e2e2e',
  borderRadius: '8px',
  padding: '1.5rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const nameStyle = {
  color: '#fff',
  fontSize: '1.25rem',
  marginBottom: '0.5rem',
};

const subtitleStyle = {
  color: '#0070f3',
  marginBottom: '1rem',
};

const detailStyle = {
  color: '#fff',
  marginBottom: '0.5rem',
};

const tagsContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '0.5rem',
  marginTop: '1rem',
};

const tagStyle = {
  backgroundColor: '#3e3e3e',
  color: '#fff',
  padding: '0.25rem 0.75rem',
  borderRadius: '999px',
  fontSize: '0.875rem',
};

const linkedinStyle = {
  display: 'inline-block',
  color: '#0070f3',
  textDecoration: 'none',
  marginTop: '1rem',
  marginBottom: '0.5rem',
};

const notesStyle = {
  color: '#ccc',
  fontSize: '0.875rem',
  marginTop: '1rem',
  padding: '0.5rem',
  backgroundColor: '#3e3e3e',
  borderRadius: '4px',
};

const dateStyle = {
  color: '#666',
  fontSize: '0.75rem',
  marginTop: '1rem',
};

const loadingStyle = {
  color: '#fff',
  textAlign: 'center' as const,
  padding: '2rem',
};

const errorStyle = {
  color: '#ff4444',
  textAlign: 'center' as const,
  padding: '2rem',
};

const emptyStyle = {
  color: '#fff',
  textAlign: 'center' as const,
  padding: '2rem',
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.5rem',
};

const editButtonStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#0070f3',
  color: '#fff',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#0051a8',
  },
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
};

const modalStyle = {
  width: '100%',
  maxWidth: '700px',
  margin: '20px',
  animation: 'modalFadeIn 0.3s ease-out',
}; 