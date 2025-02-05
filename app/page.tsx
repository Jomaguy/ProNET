"use client";

import { useState } from 'react';
import { supabase } from './supabaseClient';
import ContactForm from './ContactForm';

export default function Home() {
  return (
    <div>
      <h1>Hey, Welcome to ProNet. The professional tool to help you connect to who you need.</h1>
      <ContactForm />
    </div>
  );
}
