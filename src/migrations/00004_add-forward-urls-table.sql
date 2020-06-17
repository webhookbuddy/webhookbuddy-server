CREATE TABLE public.forward_urls
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    created_at timestamp with time zone NOT NULL,
    endpoint_id integer NOT NULL REFERENCES public.endpoints (id) ON UPDATE CASCADE ON DELETE CASCADE,
    user_id integer NOT NULL REFERENCES public.users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    url character varying(2048) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT forward_urls_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;