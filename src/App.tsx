/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import ProductList from './pages/ProductList.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import CartDrawer from './components/CartDrawer.tsx';
import Checkout from './pages/Checkout.tsx';
import { seedProductsIfEmpty } from './lib/firebaseService.ts';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#FDFBF7] font-sans text-black selection:bg-accent selection:text-white">
        <Navigation />
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<Home />} /> {/* Reuse home for now as a placeholder */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
