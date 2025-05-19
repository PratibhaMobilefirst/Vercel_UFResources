export interface Attorney {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  state: string | null;
  city: string | null;
  role: {
    name: string;
  };
  status: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttorneysResponse {
  data: Attorney[];
  meta: {
    total: number; // Total number of attorneys
    page: number; // Current page number
    totalPages: number; // Total pages available
    limit: number; // Number of items per page
  };
}
