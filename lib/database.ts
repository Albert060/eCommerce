import { ClientConfig, Pool } from 'pg';

const config: ClientConfig = {
    user: 'neondb_owner',
    database: 'neondb',
    host: 'ep-red-surf-a4quargy-pooler.us-east-1.aws.neon.tech',
    password: 'npg_nZMA7zjv0Qqg',
    connectionString: 'postgresql://neondb_owner:npg_nZMA7zjv0Qqg@ep-red-surf-a4quargy-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
}

export const database = new Pool(config)

database.connect().then(r => r)