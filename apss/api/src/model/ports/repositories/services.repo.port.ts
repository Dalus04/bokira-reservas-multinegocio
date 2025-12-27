export const SERVICES_REPO = Symbol('SERVICES_REPO');

export type ServiceForAvailability = {
  id: string;
  businessId: string;
  durationMin: number;
  isActive: boolean;
};

export type CreateServiceInput = {
  businessId: string;
  serviceCategoryId?: string | null;
  name: string;
  description?: string | null;
  price: string;       // Decimal string
  durationMin: number;
  imageUrl?: string | null;
};

export type UpdateServiceInput = {
  businessId: string;
  serviceId: string;
  serviceCategoryId?: string | null;
  name?: string;
  description?: string | null;
  price?: string;
  durationMin?: number;
  imageUrl?: string | null;
  isActive?: boolean;
};

export type ListServicesQuery = {
  businessId: string;
  q?: string;
  categoryId?: string;
  isActive?: boolean;
  page: number;
  limit: number;
};

export type ListPublicServicesQuery = {
  businessId: string;
  q?: string;
  categoryId?: string;
  page: number;
  limit: number;
};

export interface ServicesRepoPort {
  findForAvailability(serviceId: string): Promise<ServiceForAvailability | null>;

  create(input: CreateServiceInput): Promise<any>;
  update(input: UpdateServiceInput): Promise<any>;
  archive(businessId: string, serviceId: string): Promise<any>;

  findById(businessId: string, serviceId: string): Promise<any | null>;
  list(q: ListServicesQuery): Promise<{ items: any[]; total: number }>;

  publicFindById(businessId: string, serviceId: string): Promise<any | null>;
  publicList(q: ListPublicServicesQuery): Promise<{ items: any[]; total: number }>;
}
