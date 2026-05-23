# CyberStore - Premium Hardware E-Commerce Store

CyberStore is a high-fidelity, modern e-commerce platform built from scratch. It features a full-stack architecture with a React (Vite) client, an Express.js API server, and a MongoDB database.

---

## ✨ Features

* **Widescreen Responsive UI**: Tailored layouts up to `max-w-[1600px]` with adaptive grid column alignment.
* **Canvas Particles backdrop**: Fluid interconnected interactive particle field backing the catalog page.
* **Dynamic Search Seeding**: Backend automatically intercepts empty query searches and seeds MongoDB with realistic hardware items on-the-fly using high-res images and specs.
* **Cart Upgrades**: Supports delivery prioritization (Standard vs Express) and promo code coupon discounts.
* **Urgency Indicators**: Visual flame tags and custom progress bars highlighting low inventory stocks (< 12 items).
* **Fully Featured Admin Dashboard**: Real-time stats counting, inventory CRUD tables, and status-updating order management controls.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), Tailwind CSS v4, DaisyUI (Semantic UI), Framer Motion (Animations), Lucide React (Icons).
* **Backend**: Node.js, Express.js, MongoDB (Mongoose).

---

## 🚀 Setup & Running Instructions

### 1. Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org) (v18+)
* [MongoDB](https://www.mongodb.com) (Running locally on default port `27017`)

---

### 2. Backend Server setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database with initial hardware seed products:
   ```bash
   node seedProducts.js
   ```
4. Run the development server (runs on `http://localhost:5000`):
   ```bash
   npm run dev
   ```

---

### 3. Frontend Client setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite client (runs on `http://localhost:5173`):
   ```bash
   npm run dev
   ```

---

## 🎫 Promo Codes & Toggles

* **CYBER20** - 20% Off entire order.
* **WELCOME10** - 10% Off entire order.
* **HARDWARE5** - 5% Off entire order.
