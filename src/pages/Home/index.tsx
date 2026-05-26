import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Star, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { productService } from '../../services';
import { ROUTES, QUERY_KEYS } from '../../utils/constants';
import { Card, Button, Spinner, Badge } from '../../components/ui';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../hooks';

const HomePage: React.FC = () => {
  const { addToCart } = useCart();

  const { data: productsData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'featured'],
    queryFn: () => productService.getProducts(1, 8),
  });

  const { data: categories } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => productService.getCategories(),
  });

  const heroSlides = [
    {
      title: 'Summer Sale',
      subtitle: 'Up to 50% off on selected items',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
      cta: 'Shop Now',
    },
    {
      title: 'New Arrivals',
      subtitle: 'Discover the latest products',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
      cta: 'Explore',
    },
  ];

  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentSlide === index ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
            style={{ pointerEvents: currentSlide === index ? 'auto' : 'none' }}
          >
            <div
              className="h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="h-full bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-6xl font-bold mb-4"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-2xl mb-8"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link to={ROUTES.PRODUCTS}>
                      <Button size="lg" rightIcon={<ChevronRight />}>
                        {slide.cta}
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories?.slice(0, 5).map((category) => (
            <Link key={category.id} to={`${ROUTES.PRODUCTS}?category=${category.slug}`}>
              <Card hover className="text-center">
                <div
                  className="h-32 bg-cover bg-center rounded-t-lg"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
          </div>
          <Link to={ROUTES.PRODUCTS}>
            <Button variant="outline" rightIcon={<ChevronRight />}>
              View All
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsData?.data.map((product) => (
              <Card key={product.id} hover padding="none" className="overflow-hidden">
                <Link to={`/products/${product.id}`}>
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${product.thumbnail})` }}
                  >
                    {product.discount && (
                      <Badge variant="error" className="m-2">
                        {product.discount}% OFF
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
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
                  <Button
                    fullWidth
                    size="sm"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center space-x-2 mb-8">
          <TrendingUp className="h-6 w-6 text-primary-600" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Today's Deals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsData?.data.slice(0, 3).map((product) => (
            <Card key={product.id} hover>
              <div className="flex space-x-4">
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      {formatCurrency(product.price)}
                    </span>
                    {product.discount && (
                      <Badge variant="error">{product.discount}% OFF</Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
