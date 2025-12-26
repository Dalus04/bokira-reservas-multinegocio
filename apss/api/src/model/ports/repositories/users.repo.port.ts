import type { CreateUserInput, UserSafe, UserWithPassword } from "src/model/domain/entities/user";

export const USERS_REPO = Symbol('USERS_REPO');

export interface UsersRepoPort {
    findByEmail(email: string): Promise<UserWithPassword | null>;
    findSafeById(id: string): Promise<UserSafe | null>;
    create(input: CreateUserInput): Promise<UserSafe>;
}
