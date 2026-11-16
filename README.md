# SECOND STORY — Curated Vintage & Streetwear Archive

> **"Pre-loved. Re-loved. Reworn."**  
> *"Good style deserves a second life."*

SECOND STORY is an editorial, modern, premium thrift fashion e-commerce platform built from scratch with Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase, and Razorpay. Designed with the high-end aesthetic of Depop, Grailed, Vinted, and SSENSE, it delivers an individual, sustainable, and authentic archival shopping experience for vintage culture enthusiasts across India.

---

## 🌟 Key Platform Features

### 1. Editorial Visual Direction & Aesthetic
- **Warm Vintage Palette**: Warm Cream (`#F5F1E8`), Charcoal Black (`#202020`), Muted Olive (`#777B55`), Vintage Brown (`#9B795B`), and Light Grey (`#E9E7E1`).
- **Typography**: Space Grotesk for bold editorial headlines, Inter for modern body text, and classic serif accents.
- **Asymmetric Layouts & Micro-Interactions**: Hover previews, smooth slideouts, and toast notifications.
- **Mobile-First & Responsive**: Built for phones, tablets, and high-resolution desktop screens.

### 2. Full Thrift Shopping Experience
- **1-of-1 Inventory Badges**: Thrift pieces are unique. The platform displays "Only 1 available" and "1-of-1 Piece" badges, strictly preventing overselling.
- **Garment Condition Hierarchy**:
  - `Brand New With Tags`
  - `Like New`
  - `Excellent`
  - `Good`
  - `Vintage` (80s / 90s archive character)
- **Flat-Lay Garment Measurements**: Exact pit-to-pit chest, total length, shoulders, waist, and inseam measurements for every item.
- **Size Guide Modal**: Complete vintage sizing guide explaining proportional shrinkage across eras and how to measure flat garments.

### 3. Sustainability Impact Tracker
Transparent environmental savings calculated from documented textile lifecycle research (Ellen MacArthur Foundation & WRAP benchmarks):
- **Water Saved**: ~2,700 Liters per reworn cotton garment avoided from virgin crop irrigation.
- **Textile Waste Avoided**: ~1.2 Kilograms of landfill waste avoided per item kept in active circulation.
- **Carbon Avoided**: ~4.5 Kilograms of CO2e reduced compared to virgin garment manufacture.

### 4. Interactive Shopping Bag & Checkout
- **Persistent Cart**: Automatically persisted in storage across page refreshes.
- **Dynamic Free Shipping Progress Bar**: Unlocks free shipping at ₹1,999 with live progress tracking.
- **Promo Coupon System**: Built-in support for promo codes (`FIRSTDROP` for 15% off, `SECONDSTORY10` for 10% off).
- **Dual Payment Support**:
  - **Razorpay Integration Architecture**: Server-side order generation (`/api/razorpay/create-order`) and cryptographic HMAC SHA-256 signature verification (`/api/razorpay/verify`).
  - **Cash on Delivery (COD)**: Doorstep courier payment for customers across India.
- **Celebration Confetti**: Dynamic celebration on completed order placement.

### 5. Role-Based Admin Studio Dashboard (`/admin`)
- **Executive Metrics**: Live sales revenue, total order volume, active inventory count, customer directory.
- **Product Management**: Full CRUD operations—add new pieces, edit prices/descriptions/measurements, upload multiple image URLs, toggle featured pieces, and mark items sold out.
- **Order Logistics & Fulfillment**: Update order statuses (`placed`, `processing`, `dispatched`, `delivered`, `cancelled`) and edit courier tracking numbers (BlueDart / Delhivery).
- **Customer Directory**: Track repeat collectors and lifetime purchase values.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14 (App Router, Server & Client Components) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS, PostCSS, Autoprefixer |
| **Motion** | Framer Motion |
| **Icons** | Lucide React |
| **Database** | PostgreSQL via Supabase (Relational schema, foreign keys, RLS policies) |
| **Payments** | Razorpay REST API & HMAC Verification |
| **Form & State** | React Context (Auth, Cart, Wishlist, Products, Toast) |

---

## 🗄️ Database Architecture (`supabase/schema.sql`)

The repository includes a relational schema ready for Supabase:
- `profiles`: Authenticated users with roles (`customer` vs `admin`)
- `categories`: Thrift categories (Tees, Denim, Jackets, Knits, Streetwear, etc.)
- `products`: Detailed garment attributes, sizes, conditions, measurements (JSONB), stock quantities, and image arrays
- `orders` & `order_items`: Order tracking, customer addresses (JSONB), payment methods, and references
- `cart_items` & `wishlists`: Server-side persistent storage for authenticated users
- `coupons`: Active discount codes and threshold rules
- `newsletter_subscribers`: Email collection for weekly drop alerts
- **Row Level Security (RLS)**: Public read for products/categories; authenticated access for orders/profiles; admin role protection for updates.

---

## 🚀 Quick Start & Installation

### 1. Clone & Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Environment Variables Setup
Copy the `.env.example` file to `.env.local`:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your Supabase and Razorpay credentials (the app runs seamlessly with mock data and test mode if credentials are not yet configured):
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
\`\`\`bash
npm run build
npm run start
\`\`\`

---

## 🔑 Demo Credentials for Testing

You can use the one-click login buttons on `/auth/login` or log in manually:

| Role | Email | Password | Access |
|---|---|---|---|
| **Editorial Director (Admin)** | `admin@secondstory.com` | `admin1234` | Full access to `/admin` dashboard, catalog CRUD, order fulfillment |
| **Customer** | `aarav@example.com` | `customer123` | Storefront, Wishlist, Cart, Checkout, Order History |

---

## 🏷️ Active Promo Codes
- `FIRSTDROP`: 15% off orders above ₹1,500
- `SECONDSTORY10`: 10% off orders above ₹999
- `VINTAGEVIP`: 20% off orders above ₹4,000

---

## 📦 Project Structure

\`\`\`
├── src/
│   ├── app/
│   │   ├── page.tsx               # Homepage
│   │   ├── layout.tsx             # Root layout with providers & nav
│   │   ├── globals.css            # Custom typography & theme styles
│   │   ├── shop/                  # Product listing & filter sidebar
│   │   ├── category/[slug]/       # Category drops
│   │   ├── product/[slug]/        # Editorial detail page & sizing
│   │   ├── cart/                  # Full cart page
│   │   ├── checkout/              # Checkout & Razorpay handling
│   │   │   └── order-success/     # Order confirmation & impact
│   │   ├── wishlist/              # Wishlist page
│   │   ├── account/               # User account & order history
│   │   ├── auth/                  # Login & Signup flows
│   │   ├── admin/                 # Protected studio dashboard
│   │   │   ├── products/          # Catalog CRUD
│   │   │   ├── orders/            # Order status & tracking
│   │   │   └── customers/         # Customer directory
│   │   ├── about/                 # Editorial manifesto
│   │   ├── contact/               # Contact form & FAQs
│   │   ├── not-found.tsx          # Custom 404 page
│   │   └── api/                   # Razorpay API routes
│   ├── components/                # Modular reusable components
│   ├── context/                   # Cart, Wishlist, Auth, Product, Toast
│   ├── data/                      # Initial archive products & categories
│   ├── lib/                       # Supabase client, Razorpay, utilities
│   └── types/                     # TypeScript data interfaces
├── supabase/
│   └── schema.sql                 # PostgreSQL migrations & RLS policies
├── package.json
└── tailwind.config.js
\`\`\`

---

## © License
SECOND STORY Archive. All rights reserved.
