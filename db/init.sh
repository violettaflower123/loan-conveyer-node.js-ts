#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 --username "$DB_USER" --dbname "$DB_NAME" <<-EOSQL
   \i /docker-entrypoint-initdb.d/create-database.sql
   \i /docker-entrypoint-initdb.d/dump.sql
EOSQL
