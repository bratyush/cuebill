import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// You can specify any property from the libsql connection options
export const db = drizzle({ 
  connection: { 
    url: process.env.DATABASE_URL!, 
    authToken: process.env.DATABASE_AUTH_TOKEN!
  },
  schema
});
