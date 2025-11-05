# Migration Guide: HTML to React + TypeScript + Tailwind

## Overview

This guide documents the conversion of the VitaGlow shopping application from vanilla HTML/CSS/JavaScript to React + TypeScript + Tailwind CSS.

## Key Changes

### Technology Stack

**Before:**
- Vanilla HTML files (index.html, cart.html, etc.)
- Inline CSS and external styles.css
- Vanilla JavaScript with inline scripts
- No build process

**After:**
- React 19 with TypeScript
- Tailwind CSS 3 for styling
- Vite for build tooling
- Component-based architecture
- Type-safe development

### Project Structure

```
Old Structure:
├── index.html
├── cart.html
├── address.html
├── process.html
├── done.html
├── orderlist.html
├── track.html
├── styles.css
├── dgi.js
└── vitaglow.jpg

New Structure:
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Route-based page components
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── assets/        # Static assets
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── public/            # Public static files
├── dist/              # Build output
└── package.json       # Dependencies and scripts
```

## Component Mapping

### Old Pages → New React Components

| Old File | New Component | Description |
|----------|---------------|-------------|
| index.html | src/pages/Home.tsx | Product listing page |
| cart.html | src/pages/Cart.tsx | Shopping cart |
| address.html | src/pages/Checkout.tsx | Checkout form |
| process.html | src/pages/Process.tsx | Order processing |
| done.html | src/pages/Done.tsx | Order confirmation |
| orderlist.html | src/pages/OrderList.tsx | Order search |
| track.html | src/pages/Track.tsx | Order tracking |

### Shared Components

| Component | Purpose |
|-----------|---------|
| Header.tsx | App header with cart icon and navigation |
| Footer.tsx | App footer with social links |
| ProductCard.tsx | Product display card |
| ProductModal.tsx | Product details modal |
| Loading.tsx | Loading spinner |

## Functionality Preservation

All existing features have been preserved:

### ✅ Product Listing
- Fetches from Google Sheets CSV (same endpoint)
- Displays product images, names, prices
- Stock status indicators
- Size and quantity selection

### ✅ Shopping Cart
- Add/remove items
- Quantity management
- LocalStorage persistence
- Real-time cart count

### ✅ Coupon System
- Apply discount coupons
- Percentage and fixed amount discounts
- Fetches from Google Sheets

### ✅ Checkout
- Bangladesh division/district selection
- Phone number validation
- Email validation
- Shipping cost calculation

### ✅ Order Processing
- Submit to Google Forms (same endpoint)
- Send confirmation email
- Clear cart after success

### ✅ Order Tracking
- Search by phone number
- View order status
- Track order progress
- View order details

## API Endpoints

All API endpoints remain the same:
- Product data: Google Sheets CSV export
- Coupon data: Google Sheets CSV export
- Order submission: Google Forms
- Email: Google Apps Script

## LocalStorage Keys

Same keys are used for compatibility:
- `cart` - Shopping cart items
- `favorites` - Favorite products
- `coupon` - Applied coupon discount
- `promoc` - Promo code
- `order` - Current order data

## Type Safety

The new application includes comprehensive TypeScript types:

```typescript
interface Product {
  image: string;
  description: string;
  name: string;
  code: string;
  size: string;
  stock: number;
  price: number;
  unisex: string;
  originalIndex: number;
}

interface CartItem {
  name: string;
  price: number | string;
  code: string;
  size: string;
  quantity: number;
  image: string;
  unisex: string;
  max: number;
  originalIndex: number;
}
```

## Styling Migration

**Old:** CSS classes in styles.css  
**New:** Tailwind utility classes

Example:
```html
<!-- Old -->
<div class="product">
  <h2>Product Name</h2>
  <p class="price">৳100</p>
</div>

<!-- New -->
<div className="rounded-3xl p-2.5 shadow-lg">
  <h2 className="text-lg font-semibold">Product Name</h2>
  <p className="text-xl font-bold">৳100</p>
</div>
```

## Build & Deployment

### Development
```bash
npm install
npm run dev
# Server runs at http://localhost:5173/shop/
```

### Production Build
```bash
npm run build
# Output in dist/ folder
```

### GitHub Pages Deployment
The app is configured for GitHub Pages with:
- Base path: `/shop/`
- Automated deployment via GitHub Actions
- Workflow file: `.github/workflows/deploy.yml`

## Benefits of Migration

1. **Type Safety**: TypeScript catches errors at compile time
2. **Component Reusability**: Modular components can be reused
3. **Better Developer Experience**: Hot module replacement, fast builds
4. **Modern Tooling**: Vite provides excellent development experience
5. **Maintainability**: Clear component structure and separation of concerns
6. **Performance**: Optimized production builds with code splitting
7. **Scalability**: Easy to add new features and pages

## Migration Checklist

- [x] Set up React + TypeScript project
- [x] Configure Tailwind CSS
- [x] Convert all HTML pages to React components
- [x] Migrate CSS to Tailwind utilities
- [x] Extract JavaScript logic into React hooks
- [x] Add TypeScript type definitions
- [x] Set up routing with React Router
- [x] Configure LocalStorage utilities
- [x] Test all functionality
- [x] Set up build and deployment
- [x] Add documentation

## Testing Checklist

Before deploying to production, verify:

- [ ] Product listing loads correctly
- [ ] Product modal opens and displays details
- [ ] Cart add/remove/update works
- [ ] Coupon codes apply correctly
- [ ] Checkout form validation works
- [ ] Order submission succeeds
- [ ] Order tracking by phone works
- [ ] All navigation links work
- [ ] Mobile responsive design works
- [ ] Images load correctly

## Notes

- Original HTML files are preserved but ignored in git (.gitignore)
- All existing Google Sheets integrations remain unchanged
- No backend changes required
- Base path is configured for GitHub Pages deployment at `/shop/`

## Support

For issues or questions, refer to:
- README.md for setup instructions
- TypeScript compiler errors for type issues
- React DevTools for debugging components
