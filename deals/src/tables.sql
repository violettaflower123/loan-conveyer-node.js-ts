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
