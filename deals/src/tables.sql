CREATE TABLE gender (
  id SERIAL PRIMARY KEY,
  gender VARCHAR(255) NOT NULL
);

INSERT INTO gender (gender) VALUES ('MALE'), ('FEMALE'), ('NON_BINARY');

CREATE TABLE marital_status (
  id SERIAL PRIMARY KEY,
  marital_status VARCHAR(255) NOT NULL
);

INSERT INTO marital_status (marital_status) VALUES ('MARRIED'), ('DIVORCED'), ('SINGLE'), ('WIDOW_WIDOWER');

CREATE TABLE employment_status (
  id SERIAL PRIMARY KEY,
  employment_status VARCHAR(255) NOT NULL
);

INSERT INTO employment_status (employment_status) VALUES ('UNEMPLOYED'), ('SELF_EMPLOYED'), ('EMPLOYED'), ('BUSINESS_OWNER');

CREATE TABLE employment_position (
  id SERIAL PRIMARY KEY,
  employment_position VARCHAR(255) NOT NULL
);

INSERT INTO employment_position (employment_position) VALUES ('WORKER'), ('MID_MANAGER'), ('TOP_MANAGER'), ('OWNER');

CREATE TABLE application_status (
  id SERIAL PRIMARY KEY,
  application_status VARCHAR(255) NOT NULL
);

INSERT INTO application_status (application_status) VALUES ('PREAPPROVAL'), ('APPROVED'), ('CC_DENIED'), ('CC_APPROVED'), ('PREPARE_DOCUMENTS'), ('DOCUMENT_CREATED'), ('CLIENT_DENIED'), ('DOCUMENT_SIGNED'), ('CREDIT_ISSUED');

CREATE TABLE change_type (
  id SERIAL PRIMARY KEY,
  change_type VARCHAR(255) NOT NULL
);

INSERT INTO change_type (change_type) VALUES ('AUTOMATIC'), ('MANUAL');

CREATE TABLE credit_status (
  id SERIAL PRIMARY KEY,
  credit_status VARCHAR(255) NOT NULL
);

INSERT INTO credit_status (credit_status) VALUES ('CALCULATED'), ('ISSUED');

CREATE TABLE application (
  application_id VARCHAR PRIMARY KEY,
  client_id BIGINT,
  credit_id BIGINT,
  status VARCHAR(255),
  creation_date TIMESTAMP,
  applied_offer VARCHAR(255),
  sign_date TIMESTAMP,
  ses_code VARCHAR(255),
  status_history JSONB
);

CREATE TABLE status_history (
  status VARCHAR(255),
  time TIMESTAMP,
  change_type_id INT,
  PRIMARY KEY (status, time),
  FOREIGN KEY (change_type_id) REFERENCES change_type(id)
);

CREATE TABLE credit (
  credit_id BIGINT PRIMARY KEY,
  amount DECIMAL,
  term INT,
  monthly_payment DECIMAL,
  rate DECIMAL,
  psk DECIMAL,
  payment_schedule VARCHAR(255),
  insurance_enable BOOLEAN,
  salary_client BOOLEAN,
  credit_status_id INT,
  FOREIGN KEY (credit_status_id) REFERENCES credit_status(id)
);

CREATE TABLE client (
  client_id BIGINT PRIMARY KEY,
  last_name VARCHAR(255),
  first_name VARCHAR(255),
  middle_name VARCHAR(255),
  birth_date DATE,
  email VARCHAR(255),
  gender_id INT,
  marital_status_id INT,
  dependent_amount INT,
  passport_id VARCHAR(255),
  employment_id VARCHAR(255),
  account VARCHAR(255),
  FOREIGN KEY (gender_id) REFERENCES gender(id),
  FOREIGN KEY (marital_status_id) REFERENCES marital_status(id)
);

CREATE TABLE passport (
  passport_id VARCHAR PRIMARY KEY,
  series VARCHAR(255),
  number VARCHAR(255),
  issue_branch VARCHAR(255),
  issue_date DATE
);

CREATE TABLE employment (
  employment_id VARCHAR PRIMARY KEY,
  status_id INT,
  employer_inn VARCHAR(255),
  salary DECIMAL,
  position_id INT,
  work_experience_total INT,
  work_experience_current INT,
  FOREIGN KEY (status_id) REFERENCES employment_status(id),
  FOREIGN KEY (position_id) REFERENCES employment_position(id)
);

ALTER TABLE application
  ADD FOREIGN KEY (client_id) REFERENCES client(client_id),
  ADD FOREIGN KEY (credit_id) REFERENCES credit(credit_id);

ALTER TABLE client
  ADD FOREIGN KEY (passport_id) REFERENCES passport(passport_id),
  ADD FOREIGN KEY (employment_id) REFERENCES employment(employment_id);

CREATE SEQUENCE application_id_seq;  
-- alter table - изменить структуру существующей таблицы
ALTER TABLE application                  
-- устанавливает значение столбца application_id по умолчанию. 
-- при вставке новой записи в таблицу application, если значение столбца application_id не указано явно, то автоматически будет 
-- сгенерировано новое уникальное значение с помощью функции nextval('application_id_seq'). 
-- application_id_seq - это имя последовательности, 
-- которая предоставляет уникальные значения для столбца application_id                                          
  ALTER COLUMN application_id SET DEFAULT nextval('application_id_seq'),
-- поле должно быть обязательно заполнено
  ALTER COLUMN application_id SET NOT NULL,
  -- изменение на тип integer
  ALTER COLUMN application_id TYPE INTEGER USING application_id::integer;
  -- application_id_seq - максимальное application_id 
SELECT setval('application_id_seq', (SELECT MAX(application_id) FROM application));

CREATE SEQUENCE client_id_seq;  
ALTER TABLE client                                                                 
  ALTER COLUMN client_id SET DEFAULT nextval('client_id_seq'),
  ALTER COLUMN client_id SET NOT NULL,
  ALTER COLUMN client_id TYPE INTEGER USING client_id::integer;
SELECT setval('client_id_seq', (SELECT MAX(client_id) FROM client));

CREATE SEQUENCE credit_id_seq;
ALTER TABLE credit 
  ALTER COLUMN credit_id SET DEFAULT nextval('credit_id_seq'),
  ALTER COLUMN credit_id SET NOT NULL,
  ALTER COLUMN credit_id TYPE INTEGER USING credit_id::integer;
SELECT setval('credit_id_seq', (SELECT MAX(credit_id) FROM credit));

ALTER TABLE client
ADD CONSTRAINT passport_id_unique UNIQUE (passport_id);