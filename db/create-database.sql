DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'deals') THEN
        CREATE DATABASE deals;
    END IF;
END $$;
