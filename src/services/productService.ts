import { productServiceApi } from '../api';
import { Product, PaginatedResponse, ProductFilters, ProductSort, Category, Review, ApiResponse } from '../types';
import { API_ENDPOINTS, QUERY_KEYS } from '../utils/constants';
import { config } from '../utils/config';
import { mockProducts, mockCategories } from './mockData';

export const productService = {
  getProducts: async (
    page: number = 1,
    pageSize: number = config.pagination.defaultPageSize,
    filters?: ProductFilters,
    sort?: ProductSort
  ): Promise<PaginatedResponse<Product>> => {
    if (config.app.enableMockData) {
      // Mock implementation
      let filteredProducts = [...mockProducts];

      if (filters?.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }
      if (filters?.minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
      }
      if (filters?.maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters?.rating) {
        filteredProducts = filteredProducts.filter(p => p.rating >= filters.rating!);
      }

      if (sort) {
        filteredProducts.sort((a, b) => {
          const aValue = a[sort.field];
          const bValue = b[sort.field];
          const comparison = aValue > bValue ? 1 : -1;
          return sort.order === 'asc' ? comparison : -comparison;
        });
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = filteredProducts.slice(start, end);

      return {
        data: paginatedData,
        total: filteredProducts.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredProducts.length / pageSize),
      };
    }

    const response = await productServiceApi.get<ApiResponse<PaginatedResponse<Product>>>(
      API_ENDPOINTS.PRODUCTS,
      { params: { page, pageSize, ...filters, ...sort } }
    );
    return response.data.data!;
  },

  getProductById: async (id: string): Promise<Product> => {
    if (config.app.enableMockData) {
      const product = mockProducts.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      return product;
    }

    const response = await productServiceApi.get<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCT_DETAIL.replace(':id', id)
    );
    return response.data.data!;
  },

  getCategories: async (): Promise<Category[]> => {
    if (config.app.enableMockData) {
      return mockCategories;
    }

    const response = await productServiceApi.get<ApiResponse<Category[]>>(API_ENDPOINTS.CATEGORIES);
    return response.data.data!;
  },

  getProductReviews: async (productId: string): Promise<Review[]> => {
    const response = await productServiceApi.get<ApiResponse<Review[]>>(
      API_ENDPOINTS.PRODUCT_REVIEWS.replace(':id', productId)
    );
    return response.data.data!;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    if (config.app.enableMockData) {
      const searchLower = query.toLowerCase();
      return mockProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      ).slice(0, 10);
    }

    const response = await productServiceApi.get<ApiResponse<Product[]>>(
      API_ENDPOINTS.PRODUCTS,
      { params: { search: query, limit: 10 } }
    );
    return response.data.data!;
  },
};
