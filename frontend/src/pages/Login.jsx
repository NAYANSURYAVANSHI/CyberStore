import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Key, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-base-200/40 p-8 md:p-10 rounded-3xl border border-base-200/50 shadow-2xl space-y-6"
      >
        <div className="text-center space-y-2">
          <span className="inline-flex p-3.5 bg-primary/10 text-primary rounded-2xl mb-2">
            <LogIn size={26} />
          </span>
          <h2 className="text-3xl font-heading font-black tracking-tight text-base-content">
            Welcome Back
          </h2>
          <p className="text-sm text-base-content/60">
            Sign in to access your cart and track orders.
          </p>
        </div>

        {error && (
          <div className="alert alert-error rounded-xl py-3 text-xs font-semibold border border-error/15 shadow-sm">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label text-xs font-bold text-base-content/60 uppercase">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-base-content/40">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input input-bordered w-full pl-10 bg-base-100 rounded-xl focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label text-xs font-bold text-base-content/60 uppercase">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-base-content/40">
                <Key size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input input-bordered w-full pl-10 bg-base-100 rounded-xl focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block rounded-xl font-bold mt-4 shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-transform duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-base-content/60 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="link link-primary font-bold">
            Sign Up Now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
