
CREATE OR REPLACE FUNCTION public.handle_owner_signup()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'bilalshaif@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.handle_owner_signup() FROM anon, authenticated, PUBLIC;

DROP TRIGGER IF EXISTS on_auth_user_created_owner ON auth.users;
CREATE TRIGGER on_auth_user_created_owner
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_owner_signup();

-- Backfill in case the owner has already signed up
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE lower(email) = 'bilalshaif@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
