import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),

  // SQLite local
  DATABASE_URL: z.string().min(1),

  // JWT (lo usarás en bloque 3)
  JWT_SECRET: z.string().min(10).default('dev_secret_change_me'),
  JWT_EXPIRES_IN: z.string().min(1).default('7d'),

  // Swagger
  SWAGGER_TITLE: z.string().default('Bokira API'),
  SWAGGER_DESC: z.string().default('Backend API for Bokira (multi-business booking SaaS)'),
  SWAGGER_VERSION: z.string().default('1.0.0'),
  SWAGGER_PATH: z.string().default('api/docs'),
});

export type Env = z.infer<typeof envSchema>;
