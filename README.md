# VitaGlow Shopping App

A modern e-commerce shopping application built with React, TypeScript, and Tailwind CSS.

## Features

- **Product Catalog**: Browse products fetched from Google Sheets CSV
- **Shopping Cart**: Add/remove items with quantity management
- **Coupon System**: Apply discount coupons at checkout
- **Order Processing**: Submit orders to Google Forms
- **Order Tracking**: Search and track orders by phone number
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS
- **Bangladesh Shipping**: Division and district selection for Bangladesh addresses

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Font Awesome** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
shop/
├── public/              # Static assets
│   ├── vitaglow.jpg
│   └── done.gif
├── src/
│   ├── assets/         # Asset files
│   ├── components/     # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Loading.tsx
│   │   ├── ProductCard.tsx
│   │   └── ProductModal.tsx
│   ├── pages/          # Page components
│   │   ├── Home.tsx          # Product listing
│   │   ├── Cart.tsx          # Shopping cart
│   │   ├── Checkout.tsx      # Checkout form
│   │   ├── Process.tsx       # Order processing
│   │   ├── Done.tsx          # Order confirmation
│   │   ├── OrderList.tsx     # Order search
│   │   └── Track.tsx         # Order tracking
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   │   ├── api.ts           # API endpoints
│   │   ├── helpers.ts       # Helper functions
│   │   └── storage.ts       # LocalStorage utilities
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # App entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Features Overview

### Product Listing
- Fetches products from Google Sheets CSV
- Displays product images, names, prices, and stock status
- Out-of-stock and low-stock indicators
- Product modal with size selection and quantity controls

### Shopping Cart
- Add/remove items
- Update quantities
- Apply coupon codes
- Real-time cart count in header
- Persistent cart using LocalStorage

### Checkout
- Bangladesh division and district selection
- Phone number validation
- Email validation (optional)
- Address form with validation
- Shipping cost calculation based on quantity

### Order Processing
- Submit orders to Google Forms
- Send confirmation email (if email provided)
- Clear cart after successful submission
- Animated processing states

### Order Tracking
- Search orders by phone number
- View order status and details
- Track order progress (Processing → Confirmed → Shipped → Delivered)
- View order items and pricing

## Data Sources

The application integrates with Google Sheets for:
- Product inventory (via CSV export)
- Coupon codes (via CSV export)
- Order history (via CSV export)
- Order submission (via Google Forms)

## Deployment

The app is configured for deployment to GitHub Pages with base path `/shop/`.

To deploy:

```bash
# Build the production version
npm run build

# The dist/ folder contains the production build
# Deploy the contents to your hosting provider
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

See LICENSE.txt for details.

## Credits

VitaGlow Bangladesh © 2024-2025
