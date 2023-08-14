#!/bin/bash
set -e

POSTGRES="psql --username ${POSTGRES_USER}"

echo "Checking if database exists..."

$POSTGRES <<-EOSQL
DO $$ 
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'deals') THEN
      CREATE DATABASE deals;
   END IF;
END
$$;
EOSQL
