DO $$ 
BEGIN 
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'deals') THEN 
      EXECUTE 'CREATE DATABASE deals'; 
   END IF; 
END 
$$;
