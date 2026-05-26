import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, ShoppingCart, Heart, Share2, Minus, Plus } from 'lucide-react';
import { productService } from '../../services';
import { QUERY_KEYS, ROUTES } from '../../utils/constants';
import { Button, Card, Badge, Spinner } from '../../components/ui';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../hooks';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_DETAIL, id],
    queryFn: () => productService.getProductById(id!),
    enabled: !!id,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'related', product?.category],
    queryFn: () => productService.getProducts(1, 4, { category: product?.category }),
    enabled: !!product,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate(ROUTES.CHECKOUT);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          <div className="mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                onClick={() => setSelectedImage(idx)}
                className={`h-20 object-cover rounded-lg cursor-pointer ${
                  selectedImage === idx ? 'ring-2 ring-primary-500' : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {product.name}
          </h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <Badge variant="error">{product.discount}% OFF</Badge>
                </>
              )}
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">{product.description}</p>

          {/* Specifications */}
          {product.specifications && (
            <Card className="mb-6">
              <h3 className="font-semibold mb-3">Specifications</h3>
              <dl className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">{key}:</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Badge variant={product.inStock ? 'success' : 'error'}>
                {product.inStock ? `${product.stock} in stock` : 'Out of stock'}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 mb-6">
            <Button
              fullWidth
              size="lg"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              leftIcon={<ShoppingCart />}
            >
              Add to Cart
            </Button>
            <Button
              fullWidth
              size="lg"
              variant="secondary"
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              Buy Now
            </Button>
          </div>

          <div className="flex space-x-4">
            <Button variant="outline" leftIcon={<Heart />}>
              Wishlist
            </Button>
            <Button variant="outline" leftIcon={<Share2 />}>
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.data.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.data.filter(p => p.id !== product.id).slice(0, 4).map((p) => (
              <Card key={p.id} hover padding="none" className="overflow-hidden">
                <img src={p.thumbnail} alt={p.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{formatCurrency(p.price)}</span>
                    <Button size="sm" onClick={() => navigate(`/products/${p.id}`)}>
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
