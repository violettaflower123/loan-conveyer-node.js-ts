--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4 (Debian 15.4-1.pgdg120+1)
-- Dumped by pg_dump version 15.4 (Debian 15.4-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: application_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.application_status_enum AS ENUM (
    'PREAPPROVAL',
    'APPROVED',
    'CC_DENIED',
    'CC_PAPROVED',
    'PREPARE_DOCUMENTS',
    'DOCUMENT_CREATED',
    'CLIENT_DENIED',
    'DOCUMENT_SIGNED',
    'CREDIT_ISSUED'
);


ALTER TYPE public.application_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: application; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application (
    client_id bigint,
    credit_id bigint,
    status public.application_status_enum,
    creation_date timestamp without time zone,
    applied_offer character varying(255),
    sign_date timestamp without time zone,
    ses_code character varying(255),
    status_history jsonb,
    application_id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


ALTER TABLE public.application OWNER TO postgres;

--
-- Name: application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.application_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.application_id_seq OWNER TO postgres;

--
-- Name: application_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application_status (
    id integer NOT NULL,
    application_status public.application_status_enum NOT NULL,
    CONSTRAINT chk_application_status CHECK ((application_status = ANY (ARRAY['PREAPPROVAL'::public.application_status_enum, 'APPROVED'::public.application_status_enum, 'CC_DENIED'::public.application_status_enum, 'CC_PAPROVED'::public.application_status_enum, 'PREPARE_DOCUMENTS'::public.application_status_enum, 'DOCUMENT_CREATED'::public.application_status_enum, 'CLIENT_DENIED'::public.application_status_enum, 'DOCUMENT_SIGNED'::public.application_status_enum, 'CREDIT_ISSUED'::public.application_status_enum])))
);


ALTER TABLE public.application_status OWNER TO postgres;

--
-- Name: application_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.application_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.application_status_id_seq OWNER TO postgres;

--
-- Name: application_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.application_status_id_seq OWNED BY public.application_status.id;


--
-- Name: change_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.change_type (
    id integer NOT NULL,
    change_type character varying(255) NOT NULL
);


ALTER TABLE public.change_type OWNER TO postgres;

--
-- Name: change_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.change_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.change_type_id_seq OWNER TO postgres;

--
-- Name: change_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.change_type_id_seq OWNED BY public.change_type.id;


--
-- Name: client_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.client_id_seq OWNER TO postgres;

--
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    client_id integer DEFAULT nextval('public.client_id_seq'::regclass) NOT NULL,
    last_name character varying(255),
    first_name character varying(255),
    middle_name character varying(255),
    birth_date date,
    email character varying(255),
    gender_id integer,
    marital_status_id integer,
    dependent_amount integer,
    passport_id character varying(255),
    employment_id uuid,
    account character varying(255)
);


ALTER TABLE public.client OWNER TO postgres;

--
-- Name: credit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.credit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.credit_id_seq OWNER TO postgres;

--
-- Name: credit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credit (
    credit_id integer DEFAULT nextval('public.credit_id_seq'::regclass) NOT NULL,
    amount numeric,
    term integer,
    monthly_payment numeric,
    rate numeric,
    psk numeric,
    payment_schedule text,
    insurance_enable boolean,
    salary_client boolean,
    credit_status_id integer
);


ALTER TABLE public.credit OWNER TO postgres;

--
-- Name: credit_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credit_status (
    id integer NOT NULL,
    credit_status character varying(255) NOT NULL
);


ALTER TABLE public.credit_status OWNER TO postgres;

--
-- Name: credit_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.credit_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.credit_status_id_seq OWNER TO postgres;

--
-- Name: credit_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.credit_status_id_seq OWNED BY public.credit_status.id;


--
-- Name: employment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employment (
    status_id integer,
    employer_inn character varying(255),
    salary numeric,
    position_id integer,
    work_experience_total integer,
    work_experience_current integer,
    employment_id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


ALTER TABLE public.employment OWNER TO postgres;

--
-- Name: employment_position; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employment_position (
    id integer NOT NULL,
    employment_position character varying(255) NOT NULL,
    CONSTRAINT check_employment_position CHECK (((employment_position)::text = ANY (ARRAY[('MID_MANAGER'::character varying)::text, ('TOP_MANAGER'::character varying)::text, ('WORKER'::character varying)::text, ('OWNER'::character varying)::text])))
);


ALTER TABLE public.employment_position OWNER TO postgres;

--
-- Name: employment_position_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employment_position_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.employment_position_id_seq OWNER TO postgres;

--
-- Name: employment_position_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employment_position_id_seq OWNED BY public.employment_position.id;


--
-- Name: employment_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employment_status (
    id integer NOT NULL,
    employment_status character varying(255) NOT NULL,
    CONSTRAINT check_employment_status CHECK (((employment_status)::text = ANY (ARRAY[('UNEMPLOYED'::character varying)::text, ('SELF_EMPLOYED'::character varying)::text, ('BUSINESS_OWNER'::character varying)::text, ('EMPLOYED'::character varying)::text])))
);


ALTER TABLE public.employment_status OWNER TO postgres;

--
-- Name: employment_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employment_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.employment_status_id_seq OWNER TO postgres;

--
-- Name: employment_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employment_status_id_seq OWNED BY public.employment_status.id;


--
-- Name: gender; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gender (
    id integer NOT NULL,
    gender character varying(255) NOT NULL,
    CONSTRAINT check_gender CHECK (((gender)::text = ANY ((ARRAY['MALE'::character varying, 'FEMALE'::character varying, 'NON_BINARY'::character varying])::text[])))
);


ALTER TABLE public.gender OWNER TO postgres;

--
-- Name: gender_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gender_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gender_id_seq OWNER TO postgres;

--
-- Name: gender_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gender_id_seq OWNED BY public.gender.id;


--
-- Name: marital_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marital_status (
    id integer NOT NULL,
    marital_status character varying(255) NOT NULL
);


ALTER TABLE public.marital_status OWNER TO postgres;

--
-- Name: marital_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.marital_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.marital_status_id_seq OWNER TO postgres;

--
-- Name: marital_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.marital_status_id_seq OWNED BY public.marital_status.id;


--
-- Name: passport; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.passport (
    passport_id character varying NOT NULL,
    series character varying(255),
    number character varying(255),
    issue_branch character varying(255),
    issue_date date
);


ALTER TABLE public.passport OWNER TO postgres;

--
-- Name: status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.status_history (
    status character varying(255) NOT NULL,
    "time" timestamp without time zone NOT NULL,
    change_type_id integer,
    application_id uuid
);


ALTER TABLE public.status_history OWNER TO postgres;

--
-- Name: application_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_status ALTER COLUMN id SET DEFAULT nextval('public.application_status_id_seq'::regclass);


--
-- Name: change_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.change_type ALTER COLUMN id SET DEFAULT nextval('public.change_type_id_seq'::regclass);


--
-- Name: credit_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_status ALTER COLUMN id SET DEFAULT nextval('public.credit_status_id_seq'::regclass);


--
-- Name: employment_position id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment_position ALTER COLUMN id SET DEFAULT nextval('public.employment_position_id_seq'::regclass);


--
-- Name: employment_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment_status ALTER COLUMN id SET DEFAULT nextval('public.employment_status_id_seq'::regclass);


--
-- Name: gender id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gender ALTER COLUMN id SET DEFAULT nextval('public.gender_id_seq'::regclass);


--
-- Name: marital_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marital_status ALTER COLUMN id SET DEFAULT nextval('public.marital_status_id_seq'::regclass);


--
-- Data for Name: application; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application (client_id, credit_id, status, creation_date, applied_offer, sign_date, ses_code, status_history, application_id) FROM stdin;
145	\N	PREAPPROVAL	2023-08-07 11:35:51.434	\N	\N	\N	\N	7335358b-33c2-453b-8d81-2e554636d748
147	\N	PREAPPROVAL	2023-08-07 11:41:35.424	\N	\N	\N	\N	c15418dd-af1e-4f73-b797-b4e0fa3df2eb
150	159	CREDIT_ISSUED	2023-08-07 11:47:16.449	{"applicationId":"27fe354a-2570-4c3e-8670-e010b6affdb3","requestedAmount":10000,"totalAmount":110000,"term":12,"monthlyPayment":110027,"rate":0.07,"isInsuranceEnabled":true,"isSalaryClient":false}	2023-08-07 17:04:53.419	328940	[{"time": "2023-08-07T11:47:34.330Z", "status": "APPROVED", "changeType": "MANUAL"}, {"time": "2023-08-07T11:48:30.924Z", "status": "APPROVED", "changeType": "MANUAL"}, {"time": "2023-08-07T13:33:42.264Z", "status": "APPROVED", "changeType": "AUTOMATIC"}, {"time": "2023-08-07T13:33:46.076Z", "status": "APPROVED", "changeType": "AUTOMATIC"}, {"time": "2023-08-07T13:35:20.943Z", "status": "APPROVED", "changeType": "AUTOMATIC"}, {"time": "2023-08-07T14:04:39.775Z", "status": "APPROVED", "changeType": "AUTOMATIC"}, {"time": "2023-08-07T14:35:40.935Z", "status": "APPROVED", "changeType": "AUTOMATIC"}, {"time": "2023-08-07T14:35:55.754Z", "status": "APPROVED", "changeType": "AUTOMATIC"}, {"time": "2023-08-07T14:36:20.340Z", "status": "APPROVED", "changeType": "AUTOMATIC"}, {"time": "2023-08-07T14:36:50.514Z", "status": "APPROVED", "changeType": "AUTOMATIC"}, {"time": "2023-08-07T14:37:11.202Z", "status": "APPROVED", "changeType": "AUTOMATIC"}, {"time": "2023-08-07T14:42:46.370Z", "status": "APPROVED", "changeType": "AUTOMATIC"}, {"time": "2023-08-07T14:44:53.037Z", "status": "APPROVED", "changeType": "AUTOMATIC"}, {"time": "2023-08-07T14:45:20.073Z", "status": "APPROVED", "changeType": "AUTOMATIC"}, {"time": "2023-08-07T14:48:04.010Z", "status": "APPROVED", "changeType": "AUTOMATIC"}, {"time": "2023-08-07T17:02:07.523Z", "status": "APPROVED", "changeType": "AUTOMATIC"}, {"time": "2023-08-07T17:04:53.419Z", "status": "CREDIT_ISSUED", "changeType": "AUTOMATIC"}]	27fe354a-2570-4c3e-8670-e010b6affdb3
151	\N	CC_DENIED	2023-08-13 10:23:09.992	\N	\N	\N	\N	1288e5d6-3ef5-43d8-bc74-d7e3078adeeb
152	160	DOCUMENT_CREATED	2023-08-13 10:25:41.884	{"applicationId":"96990fcb-eaa0-4e73-9eeb-4179961584a7","requestedAmount":50000,"totalAmount":150000,"term":12,"monthlyPayment":12507,"rate":0.07,"isInsuranceEnabled":true,"isSalaryClient":false}	2023-08-13 11:22:37.609	709402	[{"time": "2023-08-13T10:26:43.371Z", "status": "APPROVED", "changeType": "MANUAL"}, {"time": "2023-08-13T11:18:27.437Z", "status": "APPROVED", "changeType": "AUTOMATIC"}, {"time": "2023-08-13T11:22:37.609Z", "status": "DOCUMENT_CREATED", "changeType": "AUTOMATIC"}]	96990fcb-eaa0-4e73-9eeb-4179961584a7
153	161	APPROVED	2023-08-13 11:29:05.53	{"applicationId":"4e6c2faf-1345-4396-91e8-478af161f19c","requestedAmount":50000,"totalAmount":150000,"term":12,"monthlyPayment":12507,"rate":0.07,"isInsuranceEnabled":true,"isSalaryClient":false}	\N	\N	[{"time": "2023-08-13T11:29:22.941Z", "status": "APPROVED", "changeType": "MANUAL"}, {"time": "2023-08-13T11:31:16.655Z", "status": "APPROVED", "changeType": "AUTOMATIC"}]	4e6c2faf-1345-4396-91e8-478af161f19c
\.


--
-- Data for Name: application_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application_status (id, application_status) FROM stdin;
1	PREAPPROVAL
2	CC_DENIED
3	APPROVED
4	CC_PAPROVED
5	PREPARE_DOCUMENTS
6	DOCUMENT_CREATED
7	CLIENT_DENIED
8	DOCUMENT_SIGNED
9	CREDIT_ISSUED
\.


--
-- Data for Name: change_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.change_type (id, change_type) FROM stdin;
1	AUTOMATIC
2	MANUAL
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client (client_id, last_name, first_name, middle_name, birth_date, email, gender_id, marital_status_id, dependent_amount, passport_id, employment_id, account) FROM stdin;
144	Doe	John	Smith	1990-01-01	vitaminka_94@mail.ru	\N	\N	\N	0000123456	\N	\N
145	Doe	John	Smith	1990-01-01	vitaminka_94@mail.ru	\N	\N	\N	0090123456	\N	\N
146	Doe	John	Smith	1990-01-01	vitaminka_94@mail.ru	\N	\N	\N	0099123456	\N	\N
147	Doe	John	Smith	1990-01-01	vitaminka_94@mail.ru	\N	\N	\N	0999123456	\N	\N
148	Doe	John	Smith	1990-01-01	vitaminka_94@mail.ru	\N	\N	\N	9999123456	\N	\N
149	Doe	John	Smith	1990-01-01	vitaminka_94@mail.ru	\N	\N	\N	9899123456	\N	\N
150	Doe	John	Smith	1990-01-01	vitaminka_94@mail.ru	1	1	2	9099123456	313b1373-5726-4efd-bca3-95cf667a7cf3	1234567890123456
151	Иванов	Иван	Иванович	1990-01-01	kutluhan92@gmail.com	\N	\N	\N	73c06912-d374-455d-9e4a-368ab3f9c642	\N	\N
152	Иванов	Иван	Иванович	1990-01-01	kutluhan92@gmail.com	1	1	2	85741e2e-00ce-4d6b-a73a-1e3dd17e7690	73f3a5d2-71fb-4225-a604-56e4ab54ac4f	5469798787675453
153	Иванов	Иван	Иванович	1985-07-15	vitaminka_94@mail.ru	3	3	2	46c3b153-b17b-426a-bd36-5c74cc310d12	04155316-5d3b-4fe7-b0ac-da575dda2603	RU1234567890
\.


--
-- Data for Name: credit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credit (credit_id, amount, term, monthly_payment, rate, psk, payment_schedule, insurance_enable, salary_client, credit_status_id) FROM stdin;
142	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
143	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
144	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
145	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
146	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
147	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
148	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
149	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
150	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
151	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
152	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
153	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
154	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
155	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
156	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
157	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
158	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	1
159	10000	12	875.5174408364895	0.06	1.0506209290037873	[{"number":1,"date":"2023-09-07","totalPayment":875.5174408364895,"interestPayment":50,"debtPayment":826,"remainingDebt":9174},{"number":2,"date":"2023-10-07","totalPayment":875.5174408364895,"interestPayment":46,"debtPayment":830,"remainingDebt":8344},{"number":3,"date":"2023-11-07","totalPayment":875.5174408364895,"interestPayment":42,"debtPayment":834,"remainingDebt":7510},{"number":4,"date":"2023-12-07","totalPayment":875.5174408364895,"interestPayment":38,"debtPayment":838,"remainingDebt":6672},{"number":5,"date":"2024-01-07","totalPayment":875.5174408364895,"interestPayment":34,"debtPayment":842,"remainingDebt":5830},{"number":6,"date":"2024-02-07","totalPayment":875.5174408364895,"interestPayment":30,"debtPayment":846,"remainingDebt":4984},{"number":7,"date":"2024-03-07","totalPayment":875.5174408364895,"interestPayment":25,"debtPayment":851,"remainingDebt":4133},{"number":8,"date":"2024-04-07","totalPayment":875.5174408364895,"interestPayment":21,"debtPayment":855,"remainingDebt":3278},{"number":9,"date":"2024-05-07","totalPayment":875.5174408364895,"interestPayment":17,"debtPayment":859,"remainingDebt":2419},{"number":10,"date":"2024-06-07","totalPayment":875.5174408364895,"interestPayment":13,"debtPayment":863,"remainingDebt":1556},{"number":11,"date":"2024-07-07","totalPayment":875.5174408364895,"interestPayment":8,"debtPayment":868,"remainingDebt":688},{"number":12,"date":"2024-08-07","totalPayment":875.5174408364895,"interestPayment":4,"debtPayment":872,"remainingDebt":-184}]	t	f	2
160	50000	12	4258	0.04000000000000001	1.02192	[{"number":1,"date":"2023-09-13","totalPayment":4258,"interestPayment":167,"debtPayment":4091,"remainingDebt":45909},{"number":2,"date":"2023-10-13","totalPayment":4258,"interestPayment":154,"debtPayment":4104,"remainingDebt":41805},{"number":3,"date":"2023-11-13","totalPayment":4258,"interestPayment":140,"debtPayment":4118,"remainingDebt":37687},{"number":4,"date":"2023-12-13","totalPayment":4258,"interestPayment":126,"debtPayment":4132,"remainingDebt":33555},{"number":5,"date":"2024-01-13","totalPayment":4258,"interestPayment":112,"debtPayment":4146,"remainingDebt":29409},{"number":6,"date":"2024-02-13","totalPayment":4258,"interestPayment":99,"debtPayment":4159,"remainingDebt":25250},{"number":7,"date":"2024-03-13","totalPayment":4258,"interestPayment":85,"debtPayment":4173,"remainingDebt":21077},{"number":8,"date":"2024-04-13","totalPayment":4258,"interestPayment":71,"debtPayment":4187,"remainingDebt":16890},{"number":9,"date":"2024-05-13","totalPayment":4258,"interestPayment":57,"debtPayment":4201,"remainingDebt":12689},{"number":10,"date":"2024-06-13","totalPayment":4258,"interestPayment":43,"debtPayment":4215,"remainingDebt":8474},{"number":11,"date":"2024-07-13","totalPayment":4258,"interestPayment":29,"debtPayment":4229,"remainingDebt":4245},{"number":12,"date":"2024-08-13","totalPayment":4258,"interestPayment":15,"debtPayment":4243,"remainingDebt":2}]	t	f	1
161	50000	12	4396	0.1	1.05504	[{"number":1,"date":"2023-09-13","totalPayment":4396,"interestPayment":417,"debtPayment":3979,"remainingDebt":46021},{"number":2,"date":"2023-10-13","totalPayment":4396,"interestPayment":384,"debtPayment":4012,"remainingDebt":42009},{"number":3,"date":"2023-11-13","totalPayment":4396,"interestPayment":351,"debtPayment":4045,"remainingDebt":37964},{"number":4,"date":"2023-12-13","totalPayment":4396,"interestPayment":317,"debtPayment":4079,"remainingDebt":33885},{"number":5,"date":"2024-01-13","totalPayment":4396,"interestPayment":283,"debtPayment":4113,"remainingDebt":29772},{"number":6,"date":"2024-02-13","totalPayment":4396,"interestPayment":249,"debtPayment":4147,"remainingDebt":25625},{"number":7,"date":"2024-03-13","totalPayment":4396,"interestPayment":214,"debtPayment":4182,"remainingDebt":21443},{"number":8,"date":"2024-04-13","totalPayment":4396,"interestPayment":179,"debtPayment":4217,"remainingDebt":17226},{"number":9,"date":"2024-05-13","totalPayment":4396,"interestPayment":144,"debtPayment":4252,"remainingDebt":12974},{"number":10,"date":"2024-06-13","totalPayment":4396,"interestPayment":109,"debtPayment":4287,"remainingDebt":8687},{"number":11,"date":"2024-07-13","totalPayment":4396,"interestPayment":73,"debtPayment":4323,"remainingDebt":4364},{"number":12,"date":"2024-08-13","totalPayment":4396,"interestPayment":37,"debtPayment":4359,"remainingDebt":5}]	t	f	1
\.


--
-- Data for Name: credit_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credit_status (id, credit_status) FROM stdin;
1	CALCULATED
2	ISSUED
\.


--
-- Data for Name: employment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employment (status_id, employer_inn, salary, position_id, work_experience_total, work_experience_current, employment_id) FROM stdin;
1	1234567890	50000	1	15	3	e4db3844-5421-406c-aa43-485ac3cc2715
1	1234567890	50000	1	15	3	bbdaafb1-4da0-4c83-be2f-3294f3537e37
1	1234567890	50000	1	15	3	c9536512-1b70-4645-813a-92fddb3db729
1	1234567890	50000	1	15	3	f32593f0-83ac-4fc0-b756-e0031c38a29e
1	1234567890	50000	1	15	3	385a3ae6-1c31-4f0c-a415-983863e754c1
1	1234567890	50000	1	15	3	dab8d09e-1e77-4eab-99d1-f65a8f6baa89
1	1234567890	50000	1	15	3	0692c1d9-f0ff-4ca8-b546-123c1392eed1
1	1234567890	50000	1	15	3	d81f33c7-6c5b-418b-a424-6b69e496832c
1	1234567890	50000	1	15	3	7afbcef4-4f6e-4d47-81d6-567d2902f7c8
1	1234567890	50000	1	15	3	84b5bb8c-7172-4a4c-9e87-73aec7f99104
1	1234567890	50000	1	15	3	5893084c-5223-4e7a-815e-8765d274044b
1	1234567890	50000	1	15	3	7f77d40f-a850-4d87-a73e-f28d34e3ca06
1	1234567890	50000	1	15	3	9ce5fd52-0921-49d9-a3e8-6ad10e4fe72a
1	1234567890	50000	1	15	3	6dde1450-2db5-402f-8885-f0de0f1859f3
1	1234567890	50000	1	15	3	b79333c2-1167-4470-829f-c971be5e62b0
1	1234567890	50000	1	15	3	dc81f910-963d-4aa5-b938-4f92ebf75c42
1	1234567890	50000	1	15	3	d8a09ad3-75e0-44af-9d14-f53ffd656246
1	1234567890	50000	1	15	3	f5ff7a2d-45e3-4938-9933-d46414578940
1	1234567890	50000	1	15	3	880ae761-eb91-4968-9126-f8439e8a409d
1	1234567890	50000	1	15	3	0e9008a5-a39a-49be-93d0-2a5e15ce5573
1	1234567890	50000	1	15	3	07542b8c-2c81-4237-bc2f-29cf1268a31b
1	1234567890	50000	1	15	3	f66f853b-b4af-42fe-a4ff-52fbf29d45cf
1	1234567890	50000	1	15	3	80ffc89d-2b3d-4f4c-8369-3138bac18461
1	1234567890	50000	1	15	3	f6dab425-352b-4b5d-942f-bef76a2f024f
1	1234567890	50000	1	15	3	09347248-8d6b-4cb4-9044-11bd20b9ccf5
1	1234567890	50000	1	15	3	f6d1bd12-7546-4012-9895-cc3ef61f666c
1	1234567890	50000	1	15	3	73212a5b-b8b7-471a-8df0-3a921721445f
1	1234567890	50000	1	15	3	ba1e22cf-4fdf-483d-b533-466627c4f927
1	1234567890	50000	1	15	3	f0f75f4b-5b77-42c6-820a-4170b4e54139
1	1234567890	50000	1	15	3	d67e5b84-f745-47a5-a59a-7c92f0e6ce2b
1	1234567890	50000	1	15	3	719e5cf7-36e1-406e-8462-126977a230a1
1	1234567890	50000	1	15	3	0b624e29-2e79-49d0-a934-100e1d547cfb
1	1234567890	50000	1	15	3	e9e97f71-4664-4561-960c-01162aa6a225
1	1234567890	50000	1	15	3	94ae13c8-8960-4139-8cd4-744f29133ac4
1	1234567890	50000	1	15	3	75418203-3e61-4df1-9e32-bc3aa0d4dc0e
1	1234567890	50000	1	15	3	31b5aadc-9d71-4680-995b-721fa73ef743
1	1234567890	50000	1	15	3	1ec83e98-b9a3-4aa6-ac3d-f7e25ad12f5a
1	1234567890	50000	1	15	3	1cc1074e-cfb7-43e5-b60c-eedc64ad82be
1	1234567890	50000	1	15	3	cc5a076c-3a9d-4d9b-867c-05732fbca82e
1	1234567890	50000	1	15	3	ec65ca79-4129-49a3-9c8e-bde4acaf9c78
1	1234567890	50000	1	15	3	a4f40e84-c31a-400d-bc65-69c98f3c751e
1	1234567890	50000	1	15	3	e02a6ce3-92ef-4f26-bd44-06c696e980ca
1	1234567890	50000	1	15	3	313b1373-5726-4efd-bca3-95cf667a7cf3
1	1234567890	50000	2	50	3	d001d18b-7cbf-4fda-a330-eccfa86c6523
1	1234567890	50000	2	50	3	4ad8dd7b-50e7-4e87-8fee-c4a9b5643786
1	1234567890	50000	2	50	3	73f3a5d2-71fb-4225-a604-56e4ab54ac4f
3	1234567890	50000	3	15	3	04155316-5d3b-4fe7-b0ac-da575dda2603
\.


--
-- Data for Name: employment_position; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employment_position (id, employment_position) FROM stdin;
1	MID_MANAGER
2	TOP_MANAGER
3	WORKER
4	OWNER
\.


--
-- Data for Name: employment_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employment_status (id, employment_status) FROM stdin;
1	EMPLOYED
2	UNEMPLOYED
3	SELF_EMPLOYED
4	BUSINESS_OWNER
\.


--
-- Data for Name: gender; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gender (id, gender) FROM stdin;
1	MALE
3	FEMALE
\.


--
-- Data for Name: marital_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.marital_status (id, marital_status) FROM stdin;
1	SINGLE
2	MARRIED
3	DIVORCED
4	WIDOW_WIDOWER
\.


--
-- Data for Name: passport; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.passport (passport_id, series, number, issue_branch, issue_date) FROM stdin;
0000123456	0000	123456	\N	\N
0090123456	0090	123456	\N	\N
0099123456	0099	123456	\N	\N
0999123456	0999	123456	\N	\N
9999123456	9999	123456	\N	\N
9899123456	9899	123456	\N	\N
9099123456	9099	123456	Branch XYZ	2023-08-07
73c06912-d374-455d-9e4a-368ab3f9c642	4512	123456	\N	\N
85741e2e-00ce-4d6b-a73a-1e3dd17e7690	4510	123456	Branch Name Here	2023-08-12
46c3b153-b17b-426a-bd36-5c74cc310d12	0909	123456	Отделение УФМС России по г. Москва	2005-06-15
\.


--
-- Data for Name: status_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.status_history (status, "time", change_type_id, application_id) FROM stdin;
APPROVED	2023-08-07 13:33:42.264	\N	27fe354a-2570-4c3e-8670-e010b6affdb3
APPROVED	2023-08-07 13:33:46.076	\N	27fe354a-2570-4c3e-8670-e010b6affdb3
APPROVED	2023-08-07 13:35:20.943	\N	27fe354a-2570-4c3e-8670-e010b6affdb3
APPROVED	2023-08-07 14:04:39.775	\N	27fe354a-2570-4c3e-8670-e010b6affdb3
APPROVED	2023-08-07 14:35:40.935	\N	27fe354a-2570-4c3e-8670-e010b6affdb3
APPROVED	2023-08-07 14:35:55.754	\N	27fe354a-2570-4c3e-8670-e010b6affdb3
APPROVED	2023-08-07 14:36:20.34	\N	27fe354a-2570-4c3e-8670-e010b6affdb3
APPROVED	2023-08-07 14:36:50.514	\N	27fe354a-2570-4c3e-8670-e010b6affdb3
APPROVED	2023-08-07 14:37:11.202	\N	27fe354a-2570-4c3e-8670-e010b6affdb3
APPROVED	2023-08-07 14:42:46.37	\N	27fe354a-2570-4c3e-8670-e010b6affdb3
APPROVED	2023-08-07 14:44:53.037	1	27fe354a-2570-4c3e-8670-e010b6affdb3
APPROVED	2023-08-07 14:45:20.073	1	27fe354a-2570-4c3e-8670-e010b6affdb3
APPROVED	2023-08-07 14:48:04.01	1	27fe354a-2570-4c3e-8670-e010b6affdb3
APPROVED	2023-08-07 17:02:07.523	1	27fe354a-2570-4c3e-8670-e010b6affdb3
APPROVED	2023-08-13 11:18:27.437	1	96990fcb-eaa0-4e73-9eeb-4179961584a7
APPROVED	2023-08-13 11:31:16.655	1	4e6c2faf-1345-4396-91e8-478af161f19c
\.


--
-- Name: application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.application_id_seq', 68, true);


--
-- Name: application_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.application_status_id_seq', 9, true);


--
-- Name: change_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.change_type_id_seq', 2, true);


--
-- Name: client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_id_seq', 153, true);


--
-- Name: credit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.credit_id_seq', 161, true);


--
-- Name: credit_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.credit_status_id_seq', 2, true);


--
-- Name: employment_position_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employment_position_id_seq', 4, true);


--
-- Name: employment_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employment_status_id_seq', 5, true);


--
-- Name: gender_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gender_id_seq', 3, true);


--
-- Name: marital_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.marital_status_id_seq', 4, true);


--
-- Name: application application_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application
    ADD CONSTRAINT application_pkey PRIMARY KEY (application_id);


--
-- Name: application_status application_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_status
    ADD CONSTRAINT application_status_pkey PRIMARY KEY (id);


--
-- Name: change_type change_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.change_type
    ADD CONSTRAINT change_type_pkey PRIMARY KEY (id);


--
-- Name: client client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (client_id);


--
-- Name: credit credit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit
    ADD CONSTRAINT credit_pkey PRIMARY KEY (credit_id);


--
-- Name: credit_status credit_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_status
    ADD CONSTRAINT credit_status_pkey PRIMARY KEY (id);


--
-- Name: employment employment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment
    ADD CONSTRAINT employment_pkey PRIMARY KEY (employment_id);


--
-- Name: employment_position employment_position_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment_position
    ADD CONSTRAINT employment_position_pkey PRIMARY KEY (id);


--
-- Name: employment_status employment_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment_status
    ADD CONSTRAINT employment_status_pkey PRIMARY KEY (id);


--
-- Name: gender gender_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gender
    ADD CONSTRAINT gender_pkey PRIMARY KEY (id);


--
-- Name: gender gender_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gender
    ADD CONSTRAINT gender_unique UNIQUE (gender);


--
-- Name: marital_status marital_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marital_status
    ADD CONSTRAINT marital_status_pkey PRIMARY KEY (id);


--
-- Name: marital_status marital_status_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marital_status
    ADD CONSTRAINT marital_status_unique UNIQUE (marital_status);


--
-- Name: client passport_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT passport_id_unique UNIQUE (passport_id);


--
-- Name: passport passport_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.passport
    ADD CONSTRAINT passport_pkey PRIMARY KEY (passport_id);


--
-- Name: status_history status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_history
    ADD CONSTRAINT status_history_pkey PRIMARY KEY (status, "time");


--
-- Name: application unique_application_credit_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application
    ADD CONSTRAINT unique_application_credit_id UNIQUE (credit_id);


--
-- Name: application_status unique_application_status; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_status
    ADD CONSTRAINT unique_application_status UNIQUE (application_status);


--
-- Name: credit unique_credit_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit
    ADD CONSTRAINT unique_credit_id UNIQUE (credit_id);


--
-- Name: client unique_employment_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT unique_employment_id UNIQUE (employment_id);


--
-- Name: unique_employment_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_employment_status ON public.employment_status USING btree (employment_status);


--
-- Name: application application_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application
    ADD CONSTRAINT application_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.client(client_id);


--
-- Name: application application_credit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application
    ADD CONSTRAINT application_credit_id_fkey FOREIGN KEY (credit_id) REFERENCES public.credit(credit_id);


--
-- Name: client client_employment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_employment_id_fkey FOREIGN KEY (employment_id) REFERENCES public.employment(employment_id);


--
-- Name: client client_gender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_gender_id_fkey FOREIGN KEY (gender_id) REFERENCES public.gender(id);


--
-- Name: client client_marital_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_marital_status_id_fkey FOREIGN KEY (marital_status_id) REFERENCES public.marital_status(id);


--
-- Name: client client_passport_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_passport_id_fkey FOREIGN KEY (passport_id) REFERENCES public.passport(passport_id);


--
-- Name: credit credit_credit_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit
    ADD CONSTRAINT credit_credit_status_id_fkey FOREIGN KEY (credit_status_id) REFERENCES public.credit_status(id);


--
-- Name: employment employment_position_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment
    ADD CONSTRAINT employment_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.employment_position(id);


--
-- Name: employment employment_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment
    ADD CONSTRAINT employment_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.employment_status(id);


--
-- Name: application fk_application_application_status; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application
    ADD CONSTRAINT fk_application_application_status FOREIGN KEY (status) REFERENCES public.application_status(application_status);


--
-- Name: status_history fk_status_history_change_type; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_history
    ADD CONSTRAINT fk_status_history_change_type FOREIGN KEY (change_type_id) REFERENCES public.change_type(id);


--
-- Name: status_history status_history_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_history
    ADD CONSTRAINT status_history_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.application(application_id);


--
-- Name: status_history status_history_change_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_history
    ADD CONSTRAINT status_history_change_type_id_fkey FOREIGN KEY (change_type_id) REFERENCES public.change_type(id);


--
-- PostgreSQL database dump complete
--

