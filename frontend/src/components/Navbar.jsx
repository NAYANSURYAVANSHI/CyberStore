import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { ShoppingCart, Sun, Moon, User, LogOut, LayoutDashboard, ShoppingBag, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount, cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { currency, currencies, changeCurrency, formatPrice } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sticky top-0 z-50 glass-nav shadow-lg transition-all duration-300">
      <div className="navbar max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 min-h-[4rem]">
        {/* Navbar Start */}
        <div className="navbar-start">
          {/* Mobile Menu */}
          <div className="dropdown lg:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle text-base-content">
              <Menu size={22} />
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-2xl bg-base-100/95 backdrop-blur-md rounded-2xl w-52 gap-2 border border-base-200/50"
            >
              <li>
                <Link to="/" className={isActive('/') ? 'active font-semibold' : ''}>
                  Catalog
                </Link>
              </li>
              {user && (
                <>
                  <li>
                    <Link to="/orders" className={isActive('/orders') ? 'active font-semibold' : ''}>
                      My Orders
                    </Link>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link to="/admin" className={isActive('/admin') ? 'active font-semibold text-primary' : 'text-primary font-medium'}>
                        Admin Panel
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>

          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-heading font-black text-2xl tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              CYBERSTORE
            </span>
          </Link>
        </div>

        {/* Navbar Center (Desktop) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2 font-medium">
            <li>
              <Link
                to="/"
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  isActive('/') ? 'bg-primary text-primary-content shadow-md' : 'text-base-content/80 hover:text-base-content hover:bg-base-200/40'
                }`}
              >
                Catalog
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link
                    to="/orders"
                    className={`px-4 py-2 rounded-full transition-all duration-200 ${
                      isActive('/orders') ? 'bg-primary text-primary-content shadow-md' : 'text-base-content/80 hover:text-base-content hover:bg-base-200/40'
                    }`}
                  >
                    My Orders
                  </Link>
                </li>
                {user.role === 'admin' && (
                  <li>
                    <Link
                      to="/admin"
                      className={`px-4 py-2 rounded-full transition-all duration-200 ${
                        isActive('/admin') ? 'bg-secondary text-secondary-content shadow-md' : 'text-secondary/90 hover:text-secondary hover:bg-secondary/10'
                      }`}
                    >
                      Admin Panel
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>

        {/* Navbar End */}
        <div className="navbar-end gap-2 md:gap-4">
          {/* Currency Selector */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-sm rounded-full gap-1 font-bold text-base-content/80 hover:bg-base-200/40 px-2">
              <span className="text-sm">{currency.flag}</span>
              <span className="hidden sm:inline text-xs">{currency.code}</span>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-2xl bg-base-100/95 backdrop-blur-md rounded-2xl w-52 gap-1 border border-base-200/50"
            >
              {currencies.map((c) => (
                <li key={c.code}>
                  <button
                    onClick={() => changeCurrency(c.code)}
                    className={`flex items-center gap-3 py-2 text-sm rounded-xl ${
                      currency.code === c.code ? 'bg-primary/10 text-primary font-bold' : 'text-base-content/75 hover:text-base-content'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span className="font-semibold">{c.code}</span>
                    <span className="text-xs text-base-content/50 ml-auto">{c.symbol}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle text-base-content hover:bg-base-200/40 transition-colors duration-200"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
          </button>

          {/* Cart Icon */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-base-content hover:bg-base-200/40">
              <div className="indicator">
                <ShoppingCart size={20} />
                {getCartCount() > 0 && (
                  <span className="badge badge-sm badge-primary indicator-item animate-pulse font-bold">
                    {getCartCount()}
                  </span>
                )}
              </div>
            </div>
            <div
              tabIndex={0}
              className="card card-compact dropdown-content w-64 md:w-80 z-[1] mt-3 shadow-2xl bg-base-100/95 backdrop-blur-md border border-base-200/50 rounded-2xl"
            >
              <div className="card-body p-4 md:p-6">
                <span className="font-bold text-lg text-base-content">{getCartCount()} Items</span>
              <span className="text-info font-medium">{formatPrice(cart?.totalPrice || 0)}</span>
                <div className="card-actions mt-4">
                  <Link to="/cart" className="btn btn-primary btn-block rounded-xl font-bold">
                    View Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* User Section */}
          {user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder hover:bg-base-200/40">
                <div className="bg-neutral text-neutral-content rounded-full w-9 h-9 flex items-center justify-center ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                  <span className="text-xs font-bold uppercase">{user.username.slice(0, 2)}</span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-2xl bg-base-100/95 backdrop-blur-md rounded-2xl w-60 gap-1 border border-base-200/50"
              >
                <div className="px-4 py-2 border-b border-base-200/40 mb-1">
                  <p className="font-bold text-base-content">{user.username}</p>
                  <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                  <p className="badge badge-xs badge-outline badge-primary mt-1 capitalize">{user.role}</p>
                </div>
                {user.role === 'admin' && (
                  <li>
                    <Link to="/admin" className="flex items-center gap-2 py-2 text-secondary font-medium">
                      <LayoutDashboard size={16} /> Admin Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/orders" className="flex items-center gap-2 py-2 text-base-content">
                    <ShoppingBag size={16} /> My Orders
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="flex items-center gap-2 py-2 text-error hover:bg-error/10 font-medium">
                    <LogOut size={16} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm rounded-full hidden sm:inline-flex text-base-content">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm rounded-full shadow-md font-bold px-4">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
