"use client";

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

interface ContactFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  company: string;
  linkedIn: string;
  notes: string;
  tags: string;
  lastContacted: string;
}

interface ContactFormProps {
  onCloseAction: () => void;
}

/* Main contact form component for collecting and storing contact information */
export default function ContactForm({ onCloseAction }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
    company: '',
    linkedIn: '',
    notes: '',
    tags: '',
    lastContacted: '',
  });

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add useEffect to check connection and table on component mount
  useEffect(() => {
    async function checkSupabaseConnection() {
      try {
        // Test the connection
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .limit(1);

        if (error) {
          console.error('Supabase connection test error:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
        } else {
          console.log('Successfully connected to Supabase, contacts table exists');
        }
      } catch (error) {
        console.error('Failed to connect to Supabase:', error);
      }
    }

    checkSupabaseConnection();
  }, []);

  /* Handle changes in form inputs and update state accordingly */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* Handle form submission and store data in Supabase */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error('Authentication error: ' + userError.message);
      }
      
      if (!user) {
        setMessage({ text: 'You must be logged in to add contacts', type: 'error' });
        return;
      }

      // Prepare the data for insertion
      const contactData = {
        user_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        job_title: formData.jobTitle,
        company: formData.company,
        linkedin: formData.linkedIn,
        notes: formData.notes,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Convert comma-separated string to array
        last_contacted: formData.lastContacted || null,
      };

      // Insert the contact
      const { data, error: insertError } = await supabase
        .from('contacts')
        .insert([contactData])
        .select();

      if (insertError) {
        console.error('Supabase error details:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint
        });
        throw new Error(insertError.message || 'Failed to insert contact');
      }

      console.log('Successfully inserted contact:', data);

      // Clear the form and show success message
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        jobTitle: '',
        company: '',
        linkedIn: '',
        notes: '',
        tags: '',
        lastContacted: '',
      });
      setMessage({ text: 'Contact added successfully!', type: 'success' });
    } catch (error) {
      console.error('Error adding contact:', error);
      setMessage({ 
        text: error instanceof Error ? error.message : 'An error occurred while adding the contact',
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
          <h2>Add New Contact</h2>
          <button type="button" onClick={onCloseAction} style={closeButtonStyle}>×</button>
        </div>
        
        {/* Basic contact information fields */}
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
        
        {/* Professional information fields */}
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
        
        {/* Additional information fields */}
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
        
        {/* Submit button */}
        <button
          type="submit"
          style={{
            ...buttonStyle,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Contact...' : 'Add Contact'}
        </button>

        {/* Message display */}
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
  '&:focus': {
    borderColor: '#0070f3',
    boxShadow: '0 0 0 2px rgba(0, 112, 243, 0.2)',
    outline: 'none',
  },
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
  '&:hover': {
    backgroundColor: '#0051a8',
    transform: 'translateY(-1px)',
  },
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
  '&:hover': {
    color: '#ff4444',
  },
};