import pgPromise from 'pg-promise';
export const pgp = pgPromise();
export const db = pgp('postgres://postgres:password@postgres:5432/deals');