export {};

declare global {
  type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data: T;
  };

  type PaginatedResponse<T> = {
    success: boolean;
    message?: string;
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };

  type Role = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };

  type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    profilePicture: string;
    roleId: number;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  };

  type UserWithHouses = User & {
    houses: Pick<House, 'id' | 'name' | 'city' | 'price' | 'isAvailable'>[];
  };

  type Image = {
    id: number;
    url: string;
    houseId: number;
  };

  type House = {
    id: number;
    name: string;
    city: string;
    address: string;
    price: number;
    description: string;
    rooms: number;
    bathrooms: number;
    dateAvailable: string;
    rented: boolean;
    rentedAt: string | null;
    rentedUntil: string | null;
    rentedById: number | null;
    isAvailable: boolean;
    ownerId: number;
    images: Image[];
    owner: Pick<User, 'id' | 'name' | 'username'>;
    rentedBy?: Pick<User, 'id' | 'name' | 'username'>;
    createdAt: string;
    updatedAt: string;
  };

  type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

  type Payment = {
    id: number;
    externalId: string;
    userId: number;
    houseId: number;
    amount: number;
    currency: string;
    status: PaymentStatus;
    provider: string;
    metadata: unknown;
    house: Pick<House, 'id' | 'name' | 'city'>;
    user?: Pick<User, 'id' | 'name' | 'username'>;
    createdAt: string;
    updatedAt: string;
  };

  type AuthTokens = {
    accessToken: string;
  };

  type LoginResponse = {
    accessToken: string;
    user: User;
  };

  type HouseSearchParams = {
    page?: number;
    limit?: number;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    rooms?: number;
    search?: string;
    sortBy?: 'price' | 'createdAt' | 'rooms';
    sortOrder?: 'asc' | 'desc';
  };

  type CreateHousePayload = {
    name: string;
    city: string;
    address: string;
    price: number;
    description: string;
    rooms: number;
    bathrooms: number;
    dateAvailable: string;
    images?: string[];
  };

  type UpdateHousePayload = Partial<Omit<CreateHousePayload, 'images'>> & {
    isAvailable?: boolean;
  };
}
