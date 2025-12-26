import { GlobalRole } from '../enums/global-role';

export type UserId = string;

export type UserSafe = {
    id: UserId;
    email: string;
    name: string;
    phone: string | null;
    globalRole: GlobalRole;
    isActive: boolean;
    createdAt: Date;
};

export type UserWithPassword = UserSafe & {
    passwordHash: string;
};

export type CreateUserInput = {
    email: string;
    passwordHash: string;
    name: string;
    phone?: string | null;
    globalRole?: GlobalRole;
    isActive?: boolean;
};
