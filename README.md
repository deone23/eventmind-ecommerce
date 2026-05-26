# EventMind E-Commerce Frontend

A production-quality, enterprise-grade e-commerce frontend built with React, TypeScript, and Vite. This application is designed to integrate with a distributed microservices backend and Kafka-driven event system for the **EventMind AI** incident remediation platform.

## 🚀 Features

### Core E-Commerce Features
- 🏠 **Home Page** with hero carousel, categories, and featured products
- 📝 **Product Listing** with advanced filters, sorting, and pagination
- 🔍 **Product Details** with image gallery, specifications, and reviews
- 🛍️ **Shopping Cart** with quantity management and price calculation
- 💳 **Checkout** with shipping address and payment method selection
- 📦 **Order Management** with order history and status tracking
- 🔐 **Authentication** (Login, Signup, Forgot Password)

### Admin Features
- 📊 **Admin Dashboard** with statistics and monitoring
- 🛠️ **Product Management** (placeholder)
- 📄 **Order Monitoring** (placeholder)

### EventMind AI Integration (Future-Ready)
- 🤖 **AI Incident Monitoring Panel**
- ⚡ **Kafka Event Stream Monitoring**
- 🚨 **DLQ (Dead Letter Queue) Alerts**
- 🔍 **AI Root Cause Analysis Dashboard**
- 📊 **Distributed Tracing Visualization**
- 🟢 **Service Health Monitoring**

## 🛠️ Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State Management:** Redux Toolkit
- **Data Fetching:** TanStack Query (React Query)
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios with interceptors
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## 📁 Project Structure

```
src/
├── api/              # Axios instances and API configuration
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable UI components
│   ├── layout/      # Layout components (Navbar, Footer)
│   └── ui/          # Base UI components (Button, Input, Card)
├── features/        # Feature-based modules (future)
├── hooks/           # Custom React hooks
├── layouts/         # Page layouts
├── pages/           # Page components
│   ├── admin/       # Admin pages
│   ├── Home/
│   ├── ProductListing/
│   ├── ProductDetail/
│   ├── Cart/
│   ├── Checkout/
│   ├── Orders/
│   └── EventMindOps/
├── routes/          # Routing configuration
├── services/        # API services and mock data
├── store/           # Redux store and slices
│   └── slices/      # Redux slices (auth, cart, notifications)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions and constants
├── App.tsx          # Root component
└── main.tsx         # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eventmind-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your API endpoints.

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t eventmind-ecommerce:latest .
```

### Run Docker Container

```bash
docker run -p 80:80 eventmind-ecommerce:latest
```

The application will be available at `http://localhost`

### Docker Compose (Optional)

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
```

Run:
```bash
docker-compose up -d
```

## 🎯 Configuration

### Environment Variables

All environment variables are prefixed with `VITE_` to be accessible in the frontend:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080
VITE_USER_SERVICE_URL=http://localhost:8081
VITE_PRODUCT_SERVICE_URL=http://localhost:8082
VITE_ORDER_SERVICE_URL=http://localhost:8083
VITE_PAYMENT_SERVICE_URL=http://localhost:8084
VITE_NOTIFICATION_SERVICE_URL=http://localhost:8085

# EventMind AI Services
VITE_KAFKA_MONITOR_URL=http://localhost:8086
VITE_INCIDENT_SERVICE_URL=http://localhost:8087
VITE_AI_SERVICE_URL=http://localhost:8088

# Application Configuration
VITE_APP_NAME=EventMind E-Commerce
VITE_ENABLE_MOCK_DATA=true

# Feature Flags
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_KAFKA_MONITORING=true
```

### Mock Data Mode

The application includes comprehensive mock data for development and testing. Set `VITE_ENABLE_MOCK_DATA=true` in your `.env` file to use mock data instead of real API calls.

**Demo Login:**
- Use any email/password combination
- Use email containing "admin" for admin access (e.g., `admin@example.com`)

## 🎨 Features in Detail

### State Management

- **Redux Toolkit** for global state:
  - Authentication state
  - Shopping cart
  - Notifications
  
- **React Query** for server state:
  - Product data
  - Orders
  - Categories
  - Service health

### API Integration

The application is designed to work with microservices:

- **user-service** - Authentication and user management
- **product-service** - Product catalog and search
- **order-service** - Order processing and tracking
- **payment-service** - Payment processing
- **notification-service** - User notifications
- **kafka-monitor** - Kafka event monitoring
- **incident-service** - Incident management
- **ai-service** - AI-powered recommendations

### Authentication Flow

1. JWT-based authentication
2. Automatic token refresh
3. Protected routes
4. Role-based access control (customer/admin)

### Dark Mode

Built-in dark mode support with:
- System preference detection
- Manual toggle
- Persistent user preference

## 🛡️ Security Features

- XSS protection via input sanitization
- CSRF token support (ready for backend integration)
- Secure HTTP headers in nginx configuration
- Environment variable validation
- JWT token management with automatic refresh

## 📊 Performance Optimizations

- Code splitting with React.lazy
- Route-based lazy loading
- Image optimization
- Memoization with React.memo, useMemo, useCallback
- Debounced search
- Virtualized lists (ready for implementation)

## 🧪 Testing (Future)

Placeholder for testing setup:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🔗 Integration with EventMind AI

This frontend is designed to integrate with the EventMind AI platform:

1. **Incident Monitoring** - Real-time incident alerts
2. **Kafka Event Tracking** - Monitor event streams and DLQ
3. **AI Remediation** - Display AI-generated fix suggestions
4. **Service Health** - Monitor microservices health
5. **Distributed Tracing** - Visualize request flows

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint (if configured)
```

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of the EventMind AI platform.

## 👤 Author

EventMind AI Team

## 🚀 Roadmap

- [ ] Complete EventMind AI integration
- [ ] Real-time Kafka event visualization
- [ ] Distributed tracing with Jaeger
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] PWA support
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Performance monitoring with Sentry
- [ ] A/B testing framework

## 🔧 Troubleshooting

### Common Issues

**Issue:** Port 5173 already in use
```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9
```

**Issue:** Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue:** Build fails
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

## 📞 Support

For issues and questions, please open an issue in the repository.

---

**Built with ❤️ for EventMind AI Platform**
