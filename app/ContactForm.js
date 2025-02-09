"use client";

import { useState } from 'react';
import { supabase } from './supabaseClient';

/* Main contact form component for collecting and storing contact information */
export default function ContactForm() {
  /* Initialize form state with empty fields for all contact information */
  const [formData, setFormData] = useState({
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

  /* Handle changes in form inputs and update state accordingly */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });  // Update specific field while preserving other values
  };

  /* Handle form submission and store data in Supabase */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Insert form data into the 'contacts' table
    const { data, error } = await supabase.from('contacts').insert([formData]);
    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted:', data);
    }
  };

  /* Render the contact form with styled input fields */
  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {/* Basic contact information fields */}
      <input name="fullName" placeholder="Full Name" onChange={handleChange} required style={inputStyle} />
      <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required style={inputStyle} />
      <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} style={inputStyle} />
      
      {/* Professional information fields */}
      <input name="jobTitle" placeholder="Job Title" onChange={handleChange} style={inputStyle} />
      <input name="company" placeholder="Company/Organization" onChange={handleChange} style={inputStyle} />
      <input name="linkedIn" placeholder="LinkedIn Profile" onChange={handleChange} style={inputStyle} />
      
      {/* Additional information and metadata fields */}
      <textarea name="notes" placeholder="Notes or Custom Fields" onChange={handleChange} style={textareaStyle}></textarea>
      <input name="tags" placeholder="Tags or Categories" onChange={handleChange} style={inputStyle} />
      <input name="lastContacted" type="date" onChange={handleChange} style={inputStyle} />
      
      {/* Submit button */}
      <button type="submit" style={buttonStyle}>Submit</button>
    </form>
  );
}

/* Styles for the contact form */
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxWidth: '400px',
  margin: '0 auto',
  padding: '20px',
  border: '1px solid #444',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  backgroundColor: '#1e1e1e',  // Dark theme background
  color: '#fff',
};

/* Base styles for input fields */
const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #555',
  fontSize: '16px',
  backgroundColor: '#2e2e2e',  // Slightly lighter background for inputs
  color: '#fff',
};

/* Extended styles for textarea, inheriting from inputStyle */
const textareaStyle = {
  ...inputStyle,
  minHeight: '80px',  // Provide more space for notes
};

/* Styles for the submit button */
const buttonStyle = {
  padding: '10px 20px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#0070f3',  // Blue accent color
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',  // Smooth hover transition
};

/* Hover effect for the submit button */
buttonStyle[':hover'] = {
  backgroundColor: '#005bb5',  // Darker blue on hover
};