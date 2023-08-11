#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 --username "$DB_USER" --dbname "$DB_NAME" <<-EOSQL
   \i create-database.sql
   \i dump.sql
EOSQL
