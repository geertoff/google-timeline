entoevoeg-- Table: public.waypoint

-- DROP TABLE public.waypoint;

CREATE TABLE public.waypoint
(
    id integer NOT NULL DEFAULT nextval('waypoint_id_seq'::regclass),
    activity_id integer,
    activity_type character(20) COLLATE pg_catalog."default",
    location geometry,
    CONSTRAINT waypoint_pkey PRIMARY KEY (id),
    CONSTRAINT activity_type_fkey FOREIGN KEY (activity_id)
        REFERENCES public.activity (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public.waypoint
    OWNER to postgres;
-- Index: fki_activity_type_fkey

-- DROP INDEX public.fki_activity_type_fkey;

CREATE INDEX fki_activity_type_fkey
    ON public.waypoint USING btree
    (activity_id ASC NULLS LAST)
    TABLESPACE pg_default;