export const SERVICES_REPO = Symbol('SERVICES_REPO');

export type ServiceForAvailability = {
    id: string;
    businessId: string;
    durationMin: number;
    isActive: boolean;
};

export interface ServicesRepoPort {
    findForAvailability(serviceId: string): Promise<ServiceForAvailability | null>;
}
