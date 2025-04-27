/*
  # Create tasks table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users.id)
      - `title` (text)
      - `description` (text)
      - `due_date` (timestamptz)
      - `points` (integer)
      - `priority` (text)
      - `categories` (text[])
      - `completed` (boolean)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `is_profile_task` (boolean)
      - `auto_complete_on_new_task` (boolean)
      - `is_daily_check_in` (boolean)

  2. Security
    - Enable RLS on `tasks` table
    - Add policies for:
      - Users can read their own tasks
      - Users can insert their own tasks
      - Users can update their own tasks
      - Users can delete their own tasks

  3. Relationships
    - Foreign key to users table
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  due_date timestamptz,
  points integer DEFAULT 0,
  priority text DEFAULT 'medium',
  categories text[] DEFAULT ARRAY[]::text[],
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  is_profile_task boolean DEFAULT false,
  auto_complete_on_new_task boolean DEFAULT false,
  is_daily_check_in boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX tasks_user_id_idx ON tasks(user_id);
CREATE INDEX tasks_completed_idx ON tasks(completed);
CREATE INDEX tasks_due_date_idx ON tasks(due_date);