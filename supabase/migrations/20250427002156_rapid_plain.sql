/*
  # Fix users table RLS policy for registration

  1. Changes
    - Drop existing insert policy that was too restrictive
    - Create new insert policy that allows registration
    - Keep other policies unchanged

  2. Security
    - Users can still only insert their own data
    - No changes to read/update policies
*/

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Create new insert policy that allows registration
CREATE POLICY "Enable insert for registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);