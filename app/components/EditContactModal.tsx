"use client";

import { useState } from 'react';
import { supabase } from '../supabaseClient';

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
}

interface EditContactModalProps {
  contact: Contact;
  onCloseAction: () => void;
  onContactUpdated: () => void;
}

export default function EditContactModal({ contact, onCloseAction, onContactUpdated }: EditContactModalProps) {
  const [formData, setFormData] = useState({
    fullName: contact.full_name,
    email: contact.email || '',
    phoneNumber: contact.phone_number || '',
    jobTitle: contact.job_title || '',
    company: contact.company || '',
    linkedIn: contact.linkedin || '',
    notes: contact.notes || '',
    tags: contact.tags?.join(', ') || '',
    lastContacted: contact.last_contacted || '',
  });

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error('Authentication error: ' + userError.message);
      }
      
      if (!user) {
        setMessage({ text: 'You must be logged in to update contacts', type: 'error' });
        return;
      }

      const updatedContact = {
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        job_title: formData.jobTitle,
        company: formData.company,
        linkedin: formData.linkedIn,
        notes: formData.notes,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        last_contacted: formData.lastContacted || null,
      };

      const { error: updateError } = await supabase
        .from('contacts')
        .update(updatedContact)
        .eq('id', contact.id)
        .eq('user_id', user.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setMessage({ text: 'Contact updated successfully!', type: 'success' });
      onContactUpdated();
      setTimeout(() => onCloseAction(), 1500);
    } catch (error) {
      console.error('Error updating contact:', error);
      setMessage({ 
        text: error instanceof Error ? error.message : 'An error occurred while updating the contact',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={headerStyle}>
          <h2>Edit Contact</h2>
          <button type="button" onClick={onCloseAction} style={closeButtonStyle}>×</button>
        </div>
        
        <input
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          style={inputStyle}
          disabled={isSubmitting}
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
          disabled={isSubmitting}
        />
        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          style={inputStyle}
          disabled={isSubmitting}
        />
        <input
          name="jobTitle"
          placeholder="Job Title"
          value={formData.jobTitle}
          onChange={handleChange}
          style={inputStyle}
          disabled={isSubmitting}
        />
        <input
          name="company"
          placeholder="Company/Organization"
          value={formData.company}
          onChange={handleChange}
          style={inputStyle}
          disabled={isSubmitting}
        />
        <input
          name="linkedIn"
          placeholder="LinkedIn Profile"
          value={formData.linkedIn}
          onChange={handleChange}
          style={inputStyle}
          disabled={isSubmitting}
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          style={textareaStyle}
          disabled={isSubmitting}
        />
        <input
          name="tags"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={handleChange}
          style={inputStyle}
          disabled={isSubmitting}
        />
        <input
          name="lastContacted"
          type="date"
          value={formData.lastContacted}
          onChange={handleChange}
          style={inputStyle}
          disabled={isSubmitting}
        />
        
        <button
          type="submit"
          style={{
            ...buttonStyle,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Contact'}
        </button>

        {message && (
          <div style={{
            ...messageStyle,
            backgroundColor: message.type === 'error' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',
          }}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: '2rem',
  color: '#fff',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '1.5rem',
  width: '100%',
  padding: '2.5rem',
  backgroundColor: '#2e2e2e',
  borderRadius: '12px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
};

const inputStyle = {
  padding: '1rem',
  borderRadius: '8px',
  border: '2px solid #444',
  backgroundColor: '#3e3e3e',
  color: '#fff',
  fontSize: '1rem',
  width: '100%',
  boxSizing: 'border-box' as const,
  transition: 'border-color 0.3s, box-shadow 0.3s',
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '120px',
  resize: 'vertical' as const,
};

const buttonStyle = {
  padding: '1rem',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#0070f3',
  color: '#fff',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const messageStyle = {
  padding: '1rem',
  borderRadius: '8px',
  marginTop: '1rem',
  textAlign: 'center' as const,
  color: '#fff',
  fontWeight: '500',
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#fff',
  fontSize: '28px',
  cursor: 'pointer',
  padding: '0.5rem',
  transition: 'color 0.3s',
}; 