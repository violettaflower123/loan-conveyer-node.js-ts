psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
 \i /docker-entrypoint-initdb.d/scripts/02-dump.sql
EOSQL
