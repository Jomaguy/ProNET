"use client";

import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function ContactForm() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('contacts').insert([formData]);
    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted:', data);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input name="fullName" placeholder="Full Name" onChange={handleChange} required style={inputStyle} />
      <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required style={inputStyle} />
      <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} style={inputStyle} />
      <input name="jobTitle" placeholder="Job Title" onChange={handleChange} style={inputStyle} />
      <input name="company" placeholder="Company/Organization" onChange={handleChange} style={inputStyle} />
      <input name="linkedIn" placeholder="LinkedIn Profile" onChange={handleChange} style={inputStyle} />
      <textarea name="notes" placeholder="Notes or Custom Fields" onChange={handleChange} style={textareaStyle}></textarea>
      <input name="tags" placeholder="Tags or Categories" onChange={handleChange} style={inputStyle} />
      <input name="lastContacted" type="date" onChange={handleChange} style={inputStyle} />
      <button type="submit" style={buttonStyle}>Submit</button>
    </form>
  );
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxWidth: '400px',
  margin: '0 auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#f9f9f9',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '16px',
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '80px',
};

const buttonStyle = {
  padding: '10px 20px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#0070f3',
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

buttonStyle[':hover'] = {
  backgroundColor: '#005bb5',
};