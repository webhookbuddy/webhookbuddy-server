ALTER TABLE public.users
    ADD COLUMN failed_login_attempts integer NOT NULL DEFAULT 0;