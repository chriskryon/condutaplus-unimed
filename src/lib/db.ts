import { Pool } from 'pg';

const pool = new Pool({
  connectionString: "postgresql://readonly_user:@Senhasenha115599@ep-noisy-surf-adcaov1u-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

export default pool;
