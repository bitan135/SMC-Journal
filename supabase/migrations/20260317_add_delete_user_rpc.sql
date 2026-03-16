-- Migration: Add delete_user RPC function
-- Required for account self-deletion from the client

CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete all user data (cascade handles trades, strategies, profiles)
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- Grant execution rights to authenticated users only
REVOKE ALL ON FUNCTION public.delete_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated;
