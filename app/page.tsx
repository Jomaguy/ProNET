"use client";

import { useState } from 'react';
import { supabase } from './supabaseClient';
import ContactForm from './ContactForm';
import AuthPage from './AuthPage';

export default function Home() {
  return <AuthPage />;
}
