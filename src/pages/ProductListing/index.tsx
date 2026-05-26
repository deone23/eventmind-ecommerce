import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Grid, List, Star } from 'lucide-react';
import { productService } from '../../services';
import { QUERY_KEYS } from '../../utils/constants';
import { Card, Button, Spinner, Badge } from '../../components/ui';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../hooks';
import { ProductFilters, ProductSort } from '../../types';

const ProductListingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
  });
  const [sort, setSort] = useState<ProductSort>({ field: 'createdAt', order: 'desc' });

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, page, filters, sort],
    queryFn: () => productService.getProducts(page, 20, filters, sort),
  });

  const { data: categories } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => productService.getCategories(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Filters</h3>
              <Filter className="h-5 w-5 text-gray-500" />
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={!filters.category}
                    onChange={() => setFilters({ ...filters, category: undefined })}
                    className="mr-2"
                  />
                  All
                </label>
                {categories?.map((cat) => (
                  <label key={cat.id} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === cat.name}
                      onChange={() => setFilters({ ...filters, category: cat.name })}
                      className="mr-2"
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-medium mb-3">Rating</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => setFilters({ ...filters, rating })}
                      className="mr-2"
                    />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1">{rating}+ Stars</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {filters.category || 'All Products'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {data?.total || 0} products found
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={`${sort.field}-${sort.order}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSort({ field: field as any, order: order as any });
                }}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="createdAt-desc">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating</option>
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100' : ''}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100' : ''}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {data?.data.map((product) => (
                  <Card key={product.id} hover padding="none" className="overflow-hidden">
                    <Link to={`/products/${product.id}`}>
                      <div className={viewMode === 'grid' ? '' : 'flex'}>
                        <div
                          className={viewMode === 'grid' ? 'h-48 bg-cover bg-center' : 'w-48 h-48 bg-cover bg-center flex-shrink-0'}
                          style={{ backgroundImage: `url(${product.thumbnail})` }}
                        >
                          {product.discount && (
                            <Badge variant="error" className="m-2">
                              {product.discount}% OFF
                            </Badge>
                          )}
                        </div>
                        <div className="p-4 flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center mb-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm">
                              {product.rating} ({product.reviewCount})
                            </span>
                          </div>
                          <div className="mb-3">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              {formatCurrency(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="px-4 pb-4">
                      <Button fullWidth size="sm" onClick={() => addToCart(product)}>
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? 'primary' : 'outline'}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    disabled={page === data.totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
