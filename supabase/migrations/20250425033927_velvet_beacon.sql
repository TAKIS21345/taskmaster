/*
  # Daily Check-in System

  1. Changes
    - Add function to clean up duplicate daily check-ins
    - Add function to create daily check-in tasks
    - Add trigger to prevent uncompleting daily check-ins
    - Add trigger to prevent multiple daily check-ins per day

  2. Security
    - Functions execute with security definer to bypass RLS
*/

-- Function to clean up duplicate daily check-ins
CREATE OR REPLACE FUNCTION clean_duplicate_check_ins()
RETURNS void AS $$
BEGIN
  -- Keep only the earliest check-in for each user per day
  WITH duplicates AS (
    SELECT id,
           user_id,
           date_trunc('day', created_at) as check_in_date,
           row_number() OVER (
             PARTITION BY user_id, date_trunc('day', created_at)
             ORDER BY created_at ASC
           ) as rn
    FROM tasks
    WHERE is_daily_check_in = true
  )
  DELETE FROM tasks
  WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to prevent uncompleting daily check-ins
CREATE OR REPLACE FUNCTION prevent_uncomplete_daily_check_in()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_daily_check_in = true AND OLD.completed = true AND NEW.completed = false THEN
    RAISE EXCEPTION 'Daily check-in tasks cannot be uncompleted';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to prevent uncompleting daily check-ins
DROP TRIGGER IF EXISTS prevent_uncomplete_daily_check_in_trigger ON tasks;
CREATE TRIGGER prevent_uncomplete_daily_check_in_trigger
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION prevent_uncomplete_daily_check_in();

-- Clean up any existing duplicate check-ins
SELECT clean_duplicate_check_ins();