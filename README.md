# Pocket — Personal Expense & Savings Tracker

Pocket is a lightweight, responsive personal finance web application built to track earnings, daily expenses, available balance, savings, and purchase goals with Indian Rupee (₹) formatting.

## Features

- **Dashboard**: Minimal summary showing available balance, total income, total expenses, goal savings allocations, recent transactions, and goal progress.
- **Income Management**: Record, edit, and delete earnings (Salary, Freelance, Business, Gifts, Other) with sources and notes.
- **Expense Management**: Record, edit, and delete daily expenses (Food, Transport, Shopping, Education, Bills, Subscriptions, Entertainment, Other) with payment methods and search.
- **Savings Goals**: Set target purchase goals, track progress percentages, remaining amounts, and manually allocate funds.
- **Transaction History**: Complete searchable ledger with multi-criteria filtering and export/import JSON backup.
- **Monthly Reports**: Analytical breakdown of monthly income, expenses, net savings, and category distribution with month-over-month comparisons.
- **3D Savings Vault**: Interactive Three.js 3D visualization of your savings goals with PBR materials and studio lighting.
- **Local Storage & Backup**: Persistent browser localStorage with JSON backup export and validated import restoration.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

## Production Build & Vercel Deployment

1. Build for production:
   ```bash
   npm run build
   ```
2. The production output will be generated in the `dist` directory.
3. Deploy to Vercel by connecting your repository and verifying the build command:
   - Build Command: `npm run build`
   - Output Directory: `dist`
