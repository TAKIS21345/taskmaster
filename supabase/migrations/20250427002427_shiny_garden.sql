/*
  # Remove daily check-in tasks

  1. Changes
    - Delete all daily check-in tasks
    - Drop the prevent_uncomplete_daily_check_in function and trigger
    - Drop the clean_duplicate_check_ins function
*/

-- Delete all daily check-in tasks
DELETE FROM tasks WHERE is_daily_check_in = true;

-- Drop the trigger
DROP TRIGGER IF EXISTS prevent_uncomplete_daily_check_in_trigger ON tasks;

-- Drop the functions
DROP FUNCTION IF EXISTS prevent_uncomplete_daily_check_in();
DROP FUNCTION IF EXISTS clean_duplicate_check_ins();