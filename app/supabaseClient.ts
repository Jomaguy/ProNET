/* Supabase Client Configuration
 * This file sets up and exports the Supabase client instance
 * for database operations and authentication throughout the application.
 */

/* Import the Supabase client creation utility */
import { createClient } from '@supabase/supabase-js'

/* Supabase project URL - unique to your project */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

/* Supabase anon/public key - stored in environment variables for security
 * This key should be restricted to only the permissions needed for client-side operations
 */
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

/* Create and export the Supabase client instance
 * This instance will be used for all database operations and authentication
 * throughout the application
 */
export const supabase = createClient(supabaseUrl, supabaseKey)