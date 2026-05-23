import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { productsAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import useParticleCanvas from '../hooks/useParticleCanvas';
import {
  Search, Plus, ShoppingBag, CheckCircle2, Star, Sparkles,
  SlidersHorizontal, X, ChevronDown, Zap, Package, TrendingUp,
  Heart, Eye, LayoutGrid, List, Filter, ArrowUpDown,
} from 'lucide-react';

/* ─── Constants ───────────────────────────────────────────────── */
const CATEGORIES = [
  { name: 'All',          icon: '✦',  color: 'text-primary'  },
  { name: 'Smartphones',  icon: '📱',  color: 'text-blue-400'  },
  { name: 'Laptops',      icon: '💻',  color: 'text-violet-400'},
  { name: 'Tablets',      icon: '⬛',  color: 'text-indigo-400'},
  { name: 'Accessories',  icon: '🎧',  color: 'text-pink-400'  },
];

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-low',  label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'alpha',      label: 'A → Z' },
];

/* ─── Skeleton card ───────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="animate-pulse rounded-3xl overflow-hidden bg-base-200/60 border border-base-300/30">
    <div className="aspect-[4/3] m-3 rounded-2xl bg-base-300/50" />
    <div className="p-5 space-y-3">
      <div className="h-2 w-16 rounded-full bg-base-300/60" />
      <div className="h-4 w-3/4 rounded-full bg-base-300/60" />
      <div className="h-3 w-full rounded-full bg-base-300/40" />
      <div className="h-3 w-2/3 rounded-full bg-base-300/40" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 w-20 rounded-full bg-base-300/60" />
        <div className="h-10 w-10 rounded-full bg-base-300/60" />
      </div>
    </div>
  </div>
);

/* ─── Product Card ───────────────────────────────────────────── */
const ProductCard = React.memo(({ product, onAddToCart, formatPrice, viewMode }) => {
  const [liked, setLiked] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    await onAddToCart(product._id, product.name);
    setTimeout(() => setAdding(false), 800);
  };

  const discountPct = product.discountPercentage || Math.floor(Math.random() * 20 + 5);
  const isNew = product.stock_quantity > 50;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity < 12;

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          to={`/products/${product._id}`}
          className="flex gap-4 p-4 rounded-2xl bg-base-200/40 border border-base-300/40 hover:border-primary/40 hover:bg-base-200/70 transition-all duration-300 group"
        >
          <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-base-300/30">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary/80 block">{product.category}</span>
              <h3 className="font-heading font-bold text-base text-base-content group-hover:text-primary transition-colors truncate">{product.name}</h3>
              <p className="text-xs text-base-content/50 mt-0.5 line-clamp-1">{product.description}</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="text-xl font-black text-base-content">{formatPrice(product.price)}</span>
              <button
                onClick={handleAdd}
                disabled={product.stock_quantity <= 0 || adding}
                className="btn btn-primary btn-sm rounded-xl gap-2"
              >
                {adding ? <span className="loading loading-spinner loading-xs" /> : <Plus size={14} />}
                Add
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link
        to={`/products/${product._id}`}
        className="dribbble-card flex flex-col justify-between h-full relative block"
      >
        {/* Badges */}
        <div className="absolute top-5 left-5 z-10 flex flex-col gap-1.5">
          {isNew && (
            <span className="badge badge-xs bg-primary text-primary-content font-bold px-2 py-2 rounded-lg shadow-lg shadow-primary/30 uppercase tracking-widest text-[9px]">
              New
            </span>
          )}
          {product.stock_quantity <= 0 && (
            <span className="badge badge-xs badge-error font-bold px-2 py-2 rounded-lg uppercase tracking-widest text-[9px]">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(l => !l); }}
          className={`absolute top-5 right-5 z-10 btn btn-circle btn-xs shadow-md transition-all duration-300 ${liked ? 'bg-red-500 border-red-500 text-white scale-110' : 'bg-base-100/80 backdrop-blur-sm border-base-300/50 text-base-content/50 hover:text-red-400'}`}
          aria-label="Wishlist"
        >
          <Heart size={11} fill={liked ? 'currentColor' : 'none'} />
        </button>

        {/* Image */}
        <div className="relative aspect-[4/3] m-3 rounded-2xl overflow-hidden bg-base-300/30">
          <img
            src={product.image_url || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />

          {/* Hover overlay with Quick View */}
          <div className="absolute inset-0 bg-base-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
            <span className="flex items-center gap-1.5 px-4 py-2 bg-base-100/90 backdrop-blur-md rounded-full text-xs font-bold text-base-content shadow-xl border border-base-200/40">
              <Eye size={13} /> Quick View
            </span>
          </div>

          {/* Rating pill */}
          <div className="absolute bottom-2.5 left-2.5 bg-base-100/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 shadow-md border border-base-200/30">
            <Star className="text-amber-400 fill-amber-400" size={10} />
            <span className="text-[10px] font-black text-base-content">
              {product.rating ? product.rating.toFixed(1) : (4.0 + Math.random()).toFixed(1)}
            </span>
          </div>

          {/* Discount tag */}
          <div className="absolute bottom-2.5 right-2.5 bg-green-500 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-md">
            -{discountPct}%
          </div>
        </div>

        {/* Content */}
        <div className="p-5 pt-2 flex flex-col flex-grow justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-primary/80">{product.category}</span>
            <h3 className="font-heading font-bold text-base text-base-content group-hover:text-primary transition-colors duration-200 line-clamp-1 mt-0.5">
              {product.name}
            </h3>
            <p className="text-xs text-base-content/45 mt-1 line-clamp-2 leading-relaxed min-h-[2rem]">
              {product.description}
            </p>

            {/* Spec tags */}
            {product.specs && product.specs.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2.5">
                {product.specs.slice(0, 3).map((spec, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-base-300/40 rounded-lg text-[9px] font-semibold text-base-content/60 border border-base-300/10">
                    {spec}
                  </span>
                ))}
              </div>
            )}

            {/* Low stock warning */}
            {isLowStock && (
              <div className="mt-3 space-y-1">
                <div className="flex justify-between items-center text-[9px] font-extrabold text-red-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">⚡ Only {product.stock_quantity} left</span>
                  <span className="animate-pulse">Selling out!</span>
                </div>
                <div className="w-full bg-base-300/35 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500 h-full rounded-full" 
                    style={{ width: `${(product.stock_quantity / 12) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Price + CTA */}
          <div className="mt-4 flex items-center justify-between border-t border-base-300/25 pt-4">
            <div>
              <span className="text-xl font-black text-base-content">{formatPrice(product.price)}</span>
              <span className="ml-2 text-xs text-base-content/35 line-through">
                {formatPrice(product.price * (1 + discountPct / 100))}
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleAdd}
              disabled={product.stock_quantity <= 0 || adding}
              className="btn btn-primary btn-circle btn-md shadow-lg shadow-primary/25 relative overflow-hidden"
              aria-label="Add to cart"
            >
              <AnimatePresence mode="wait" initial={false}>
                {adding ? (
                  <motion.span key="spin" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <span className="loading loading-spinner loading-xs" />
                  </motion.span>
                ) : (
                  <motion.span key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Plus size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

/* ─── Main Products Page ─────────────────────────────────────── */
const Products = () => {
  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery]     = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy]               = useState('newest');
  const [toast, setToast]                 = useState({ show: false, message: '', ok: true });
  const [viewMode, setViewMode]           = useState('grid'); // 'grid' | 'list'
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [priceRange, setPriceRange]       = useState([0, 1000]);
  const [maxPrice, setMaxPrice]           = useState(1000);
  const [inStockOnly, setInStockOnly]     = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  const { addToCart }    = useCart();
  const { formatPrice }  = useCurrency();
  const { theme }        = useTheme();
  const isDark           = theme === 'dark';
  const canvasRef        = useParticleCanvas(isDark);

  // Debounce search query to prevent spamming queries on every keypress
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* Load products */
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, debouncedSearch]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (debouncedSearch) params.search = debouncedSearch;
      params.limit = 194;
      const res = await productsAPI.getAll(params);
      const data = res.data?.data || [];
      setProducts(data);
      // Compute max price for slider
      const max = Math.ceil(Math.max(...data.map(p => p.price), 500));
      setMaxPrice(max);
      setPriceRange([0, max]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* Add to cart */
  const handleAddToCart = useCallback(async (productId, productName) => {
    const res = await addToCart(productId, 1);
    if (res.success) showToast(`Added to cart!`, true);
    else showToast(res.error || 'Failed.', false);
  }, [addToCart]);

  const showToast = (message, ok = true) => {
    setToast({ show: true, message, ok });
    setTimeout(() => setToast({ show: false, message: '', ok: true }), 2800);
  };

  /* Filtering */
  const filtered = products.filter((p) => {
    const matchPrice  = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchStock  = inStockOnly ? p.stock_quantity > 0 : true;
    return matchPrice && matchStock;
  });

  /* Sorting */
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low')  return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'alpha')      return a.name.localeCompare(b.name);
    if (sortBy === 'rating')     return (b.rating || 4) - (a.rating || 4);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  /* Active filter chips */
  const chips = [];
  if (selectedCategory !== 'All') chips.push({ label: selectedCategory, clear: () => setSelectedCategory('All') });
  if (inStockOnly) chips.push({ label: 'In Stock', clear: () => setInStockOnly(false) });
  if (priceRange[1] < maxPrice) chips.push({ label: `≤ ${formatPrice(priceRange[1])}`, clear: () => setPriceRange([0, maxPrice]) });
  if (searchQuery) chips.push({ label: `"${searchQuery}"`, clear: () => setSearchQuery('') });

  const clearAll = () => { setSelectedCategory('All'); setInStockOnly(false); setPriceRange([0, maxPrice]); setSearchQuery(''); };

  /* Category counts */
  const catCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.name] = cat.name === 'All'
      ? products.length
      : products.filter(p => p.category === cat.name).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-base-100 text-base-content pb-24 relative overflow-x-hidden">

      {/* ─── Canvas Hero ─────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ height: '520px' }}>
        {/* particle canvas fills the hero */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: 'none' }}
        />

        {/* radial gradient overlays */}
        <div className="absolute inset-0 hero-gradient grid-bg" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base-100 to-transparent" />

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/25 rounded-full text-primary font-bold text-xs uppercase tracking-widest glow-badge-primary"
          >
            <Sparkles size={13} className="animate-pulse" /> Hardware · Phones · Laptops · Accessories
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-black text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] max-w-4xl"
          >
            The Best{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Hardware
            </span>
            {' '}Gear.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base-content/60 max-w-lg text-base md:text-lg font-medium leading-relaxed"
          >
            Curated phones, laptops, tablets, and accessories. All real brands. Instant currency conversion.
          </motion.p>

          {/* Stat Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 flex-wrap justify-center"
          >
            {[
              { icon: <Package size={13} />, label: `${products.length} Products` },
              { icon: <TrendingUp size={13} />, label: '4 Categories' },
              { icon: <Zap size={13} />, label: '8 Currencies' },
            ].map(({ icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 px-4 py-2 bg-base-200/60 backdrop-blur-md border border-base-300/50 rounded-full text-xs font-semibold text-base-content/70 shadow-sm">
                {icon} {label}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── Control Bar ─────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 -mt-4 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center p-3 bg-base-200/70 backdrop-blur-xl border border-base-300/50 rounded-[1.75rem] shadow-xl shadow-base-300/20"
        >
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
            <input
              type="text"
              placeholder="Search phones, laptops, tablets…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full pl-11 pr-4 py-3 bg-base-100/70 border border-base-300/40 rounded-[1.25rem] focus:outline-none focus:border-primary/60 text-sm font-medium placeholder:text-base-content/35 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content">
                <X size={15} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" size={14} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select pl-9 pr-8 py-3 bg-base-100/70 border border-base-300/40 rounded-[1.25rem] focus:outline-none focus:border-primary/60 text-sm font-bold appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className={`flex items-center gap-2 px-5 py-3 rounded-[1.25rem] font-bold text-sm transition-all duration-200 border ${sidebarOpen ? 'bg-primary text-primary-content border-primary shadow-lg shadow-primary/25' : 'bg-base-100/70 border-base-300/40 text-base-content/70 hover:text-base-content hover:border-primary/40'}`}
          >
            <Filter size={15} />
            Filters
            {chips.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-black flex items-center justify-center">{chips.length}</span>
            )}
          </button>

          {/* View toggle */}
          <div className="flex bg-base-100/70 border border-base-300/40 rounded-[1.25rem] p-1 gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-[0.85rem] transition-all ${viewMode === 'grid' ? 'bg-primary text-primary-content shadow-md' : 'text-base-content/50 hover:text-base-content'}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-[0.85rem] transition-all ${viewMode === 'list' ? 'bg-primary text-primary-content shadow-md' : 'text-base-content/50 hover:text-base-content'}`}
            >
              <List size={15} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ─── Filter Sidebar + Grid ────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 mt-6 flex gap-6 items-start">

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ opacity: 0, x: -20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 280 }}
              exit={{ opacity: 0, x: -20, width: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-shrink-0 overflow-hidden"
            >
              <div className="w-[280px] bg-base-200/50 backdrop-blur-md border border-base-300/40 rounded-3xl p-5 space-y-7 sticky top-24">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base">Filters</h3>
                  {chips.length > 0 && (
                    <button onClick={clearAll} className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                      <X size={11} /> Clear all
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-extrabold text-base-content/50 mb-3">Category</p>
                  <div className="space-y-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${selectedCategory === cat.name ? 'bg-primary/10 text-primary border border-primary/25' : 'text-base-content/65 hover:text-base-content hover:bg-base-300/40'}`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${selectedCategory === cat.name ? 'bg-primary/20 text-primary' : 'bg-base-300/60 text-base-content/40'}`}>
                          {catCounts[cat.name] || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] uppercase tracking-widest font-extrabold text-base-content/50">Price Range</p>
                    <span className="text-xs font-bold text-primary">{formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}</span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min={0}
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                      className="range range-primary range-sm w-full"
                    />
                    <div className="flex justify-between text-[10px] text-base-content/40 font-semibold">
                      <span>{formatPrice(0)}</span>
                      <span>{formatPrice(maxPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-extrabold text-base-content/50 mb-3">Availability</p>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-semibold text-base-content/70">In Stock Only</span>
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="toggle toggle-primary toggle-sm"
                    />
                  </label>
                </div>

                {/* Results count */}
                <div className="border-t border-base-300/40 pt-4">
                  <p className="text-xs text-base-content/50 text-center">
                    Showing <span className="font-bold text-primary">{sorted.length}</span> of <span className="font-bold">{products.length}</span> products
                  </p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Active filter chips */}
          <AnimatePresence>
            {chips.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 mb-5 overflow-hidden"
              >
                {chips.map((chip, i) => (
                  <motion.button
                    key={chip.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={chip.clear}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/25 text-primary rounded-full text-xs font-bold hover:bg-primary/20 transition-all"
                  >
                    {chip.label}
                    <X size={10} />
                  </motion.button>
                ))}
                <button onClick={clearAll} className="text-xs text-base-content/40 hover:text-base-content px-2 underline underline-offset-2">Clear all</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product count header */}
          {!loading && (
            <p className="text-xs text-base-content/40 font-semibold mb-5">
              {sorted.length} results {selectedCategory !== 'All' ? `in ${selectedCategory}` : ''}
            </p>
          )}

          {/* Grid / List */}
          {loading ? (
            <div className={viewMode === 'grid'
              ? `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${sidebarOpen ? 'lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4' : 'lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5'} gap-6`
              : 'flex flex-col gap-3'
            }>
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : sorted.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-80 p-8 text-center bg-base-200/20 border border-base-300/30 rounded-3xl"
            >
              <ShoppingBag size={48} className="text-base-content/20 mb-4" />
              <h3 className="font-heading font-bold text-xl mb-1">No products found</h3>
              <p className="text-sm text-base-content/40 max-w-xs">Try adjusting your search or filters.</p>
              <button onClick={clearAll} className="btn btn-primary btn-sm rounded-full mt-5">Reset Filters</button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className={viewMode === 'grid'
                ? `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${sidebarOpen ? 'lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4' : 'lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5'} gap-6`
                : 'flex flex-col gap-3'
              }
            >
              <AnimatePresence>
                {sorted.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    formatPrice={formatPrice}
                    viewMode={viewMode}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* ─── Toast ───────────────────────────────────────────── */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold backdrop-blur-md ${toast.ok ? 'bg-base-100/90 border-green-500/30 text-base-content' : 'bg-base-100/90 border-red-500/30 text-base-content'}`}>
              <CheckCircle2 size={17} className={toast.ok ? 'text-green-500' : 'text-red-500'} />
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
