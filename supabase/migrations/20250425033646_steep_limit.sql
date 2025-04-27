/*
  # Create tasks table and set up security policies

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users.id)
      - `title` (text)
      - `description` (text, nullable)
      - `due_date` (timestamptz, nullable)
      - `points` (integer, default: 0)
      - `priority` (text, default: 'medium')
      - `categories` (text[], default: [])
      - `completed` (boolean, default: false)
      - `completed_at` (timestamptz, nullable)
      - `created_at` (timestamptz, default: now())
      - `is_profile_task` (boolean, default: false)
      - `auto_complete_on_new_task` (boolean, default: false)
      - `is_daily_check_in` (boolean, default: false)

  2. Indexes
    - Index on user_id for faster lookups
    - Index on completed status
    - Index on due_date for date-based queries

  3. Security
    - Enable RLS
    - Add policies for CRUD operations
    - Only allow users to access their own tasks
*/

-- Create tasks table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS public.tasks (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Create indexes if they don't exist
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS tasks_completed_idx ON public.tasks(completed);
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON public.tasks(due_date);
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can read own tasks" ON public.tasks;
  DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
  DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
  DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;
END $$;

-- Create policies
CREATE POLICY "Users can read own tasks"
    ON public.tasks
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
    ON public.tasks
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
    ON public.tasks
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
    ON public.tasks
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);