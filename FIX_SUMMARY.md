# Deployment Fix - 404 on /api/auth/get-session

## What Was the Problem?
`next.config.ts` was proxying ALL `/api/*` to backend, including `/api/auth/*`. But backend doesn't handle auth - the frontend does with better-auth.

## What I Fixed

1. **Created:** `src/app/api/auth/[...all]/route.ts` - handles auth in Next.js
2. **Created:** `src/lib/auth.ts` - better-auth configuration  
3. **Fixed:** `next.config.ts` - only proxy specific routes (products, categories, orders, reviews), NOT auth

## To Deploy - 3 Steps

### 1. Use the SAME Database as Backend
Your backend and frontend share ONE database. Better-auth will add its tables (session, account, verification) alongside your existing tables (Product, User, Order, etc.)

In Vercel, set **the SAME `DATABASE_URL`** that your backend uses:
```
DATABASE_URL=postgresql://user:password@host/database
```

### 2. Add Auth Secret
```bash
# Generate one:
openssl rand -base64 32
```
Then add to Vercel:
```
BETTER_AUTH_SECRET=your-generated-secret
```

### 3. Push and Deploy
```bash
git add .
git commit -m "Fix: Add auth API routes"
git push origin main
```

## That's It!

After deploy, test:
- `https://simba-frontend-sigma.vercel.app/api/auth/get-session` → 401 (not 404) ✅
- `https://simba-frontend-sigma.vercel.app/api/products/featured` → products data ✅
