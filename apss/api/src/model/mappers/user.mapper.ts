import { GlobalRole } from '../domain/enums/global-role';
import type { UserSafe, UserWithPassword } from '../domain/entities/user';

type DbUserLike = {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    globalRole: string; // viene de DB como string
    isActive: boolean;
    createdAt: Date;
    passwordHash?: string;
};

export function toDomainUserSafe(db: DbUserLike): UserSafe {
    return {
        id: db.id,
        email: db.email,
        name: db.name,
        phone: db.phone ?? null,
        globalRole: db.globalRole as GlobalRole,
        isActive: db.isActive,
        createdAt: db.createdAt,
    };
}

export function toDomainUserWithPassword(db: DbUserLike): UserWithPassword {
    if (!db.passwordHash) {
        throw new Error('passwordHash missing for UserWithPassword mapping');
    }
    return {
        ...toDomainUserSafe(db),
        passwordHash: db.passwordHash,
    };
}
