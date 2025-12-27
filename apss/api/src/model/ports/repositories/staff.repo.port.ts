import type { BusinessMember } from 'src/model/domain/entities/business-member';

export const STAFF_REPO = Symbol('STAFF_REPO');

export type Paginated<T> = {
    items: T[];
    page: number;
    limit: number;
    total: number;
};

export type AddStaffMemberInput = {
    businessId: string;
    email: string;         // buscamos User por email
    role: 'STAFF' | 'MANAGER';
};

export type UpdateStaffMemberInput = {
    role?: 'STAFF' | 'MANAGER';
    isActive?: boolean;
};

export type StaffMemberView = BusinessMember & {
    user: {
        id: string;
        email: string;
        name: string;
        phone: string | null;
        isActive: boolean;
    };
};

export interface StaffRepoPort {
    list(businessId: string, page: number, limit: number): Promise<Paginated<StaffMemberView>>;

    add(input: AddStaffMemberInput): Promise<StaffMemberView>;

    update(businessId: string, memberId: string, data: UpdateStaffMemberInput): Promise<StaffMemberView>;

    // helpers (para reglas)
    findMemberById(businessId: string, memberId: string): Promise<StaffMemberView | null>;
    findUserIdByEmail(email: string): Promise<string | null>;
    existsMembership(businessId: string, userId: string): Promise<boolean>;
}
