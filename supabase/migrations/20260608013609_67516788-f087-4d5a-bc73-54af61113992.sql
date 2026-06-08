
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;

DROP POLICY IF EXISTS "anyone_can_insert_messages" ON public.contact_messages;
CREATE POLICY "anyone_can_insert_messages" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(email) BETWEEN 3 AND 255
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND char_length(message) BETWEEN 1 AND 2000
    AND char_length(coalesce(phone,'')) <= 30
    AND char_length(coalesce(subject,'')) <= 200
  );
