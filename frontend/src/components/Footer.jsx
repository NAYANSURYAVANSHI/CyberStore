import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content border-t border-base-300">
      {/* Selling Points Bar */}
      <div className="border-b border-base-300 bg-base-100/50">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Truck className="text-primary" size={28} />
            <h4 className="font-bold text-sm">Free Express Delivery</h4>
            <p className="text-xs text-base-content/60">On all orders over $150</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="text-primary" size={28} />
            <h4 className="font-bold text-sm">Easy Returns</h4>
            <p className="text-xs text-base-content/60">30-day money-back guarantee</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="text-primary" size={28} />
            <h4 className="font-bold text-sm">Secure Payment</h4>
            <p className="text-xs text-base-content/60">100% SSL protected transactions</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CreditCard className="text-primary" size={28} />
            <h4 className="font-bold text-sm">Flexible Options</h4>
            <p className="text-xs text-base-content/60">Pay with Card, PayPal, or Crypto</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <nav>
          <h6 className="footer-title opacity-80">Shop Categories</h6>
          <Link to="/" className="link link-hover text-sm opacity-70 hover:opacity-100">Electronics</Link>
          <Link to="/" className="link link-hover text-sm opacity-70 hover:opacity-100">Clothing</Link>
          <Link to="/" className="link link-hover text-sm opacity-70 hover:opacity-100">Books</Link>
          <Link to="/" className="link link-hover text-sm opacity-70 hover:opacity-100">Home & Decor</Link>
        </nav>
        <nav>
          <h6 className="footer-title opacity-80">Customer Service</h6>
          <a href="#" className="link link-hover text-sm opacity-70 hover:opacity-100">Contact Us</a>
          <a href="#" className="link link-hover text-sm opacity-70 hover:opacity-100">FAQ & Help</a>
          <a href="#" className="link link-hover text-sm opacity-70 hover:opacity-100">Shipping Rates</a>
          <a href="#" className="link link-hover text-sm opacity-70 hover:opacity-100">Refund Policy</a>
        </nav>
        <nav>
          <h6 className="footer-title opacity-80">Company</h6>
          <a href="#" className="link link-hover text-sm opacity-70 hover:opacity-100">About Us</a>
          <a href="#" className="link link-hover text-sm opacity-70 hover:opacity-100">Careers</a>
          <a href="#" className="link link-hover text-sm opacity-70 hover:opacity-100">Press Kit</a>
          <a href="#" className="link link-hover text-sm opacity-70 hover:opacity-100">Store Locator</a>
        </nav>
        <div>
          <span className="footer-title opacity-80">Stay Connected</span>
          <p className="text-sm opacity-70 mb-4 max-w-xs">
            Subscribe to our newsletter for exclusive sales, product releases, and updates.
          </p>
          <div className="join w-full max-w-sm">
            <input
              type="text"
              placeholder="email@example.com"
              className="input input-bordered join-item w-full bg-base-100 focus:outline-none focus:border-primary text-sm"
            />
            <button className="btn btn-primary join-item">Join</button>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-base-300 py-6">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-heading font-black tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CYBERSTORE
            </span>
            <p className="text-xs opacity-60">© {new Date().getFullYear()} CyberStore. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-base-content/60 hover:text-primary transition-colors" aria-label="GitHub">
              <svg size={20} viewBox="0 0 24 24" className="w-5 h-5 fill-current inline-block">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="#" className="text-base-content/60 hover:text-primary transition-colors" aria-label="X (formerly Twitter)">
              <svg size={20} viewBox="0 0 24 24" className="w-5 h-5 fill-current inline-block">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="text-base-content/60 hover:text-primary transition-colors" aria-label="Instagram">
              <svg size={20} viewBox="0 0 24 24" className="w-5 h-5 inline-block" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
