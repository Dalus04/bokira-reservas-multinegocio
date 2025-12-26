import { Injectable } from '@nestjs/common';
import { envSchema, type Env } from './env.schema';

@Injectable()
export class EnvService {
    private readonly env: Env;

    constructor() {
        const parsed = envSchema.safeParse(process.env);
        if (!parsed.success) {
            // imprime errores claros al levantar
            // eslint-disable-next-line no-console
            console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
            throw new Error('Invalid environment variables');
        }
        this.env = parsed.data;
    }

    get<K extends keyof Env>(key: K): Env[K] {
        return this.env[key];
    }
}
