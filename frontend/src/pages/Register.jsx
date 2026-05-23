import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Key } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    const res = await register(username, email, password);
    if (res.success) {
      navigate('/');
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
            <UserPlus size={26} />
          </span>
          <h2 className="text-3xl font-heading font-black tracking-tight text-base-content">
            Create Account
          </h2>
          <p className="text-sm text-base-content/60">
            Join CyberStore today and start shopping.
          </p>
        </div>

        {error && (
          <div className="alert alert-error rounded-xl py-3 text-xs font-semibold border border-error/15 shadow-sm">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label text-xs font-bold text-base-content/60 uppercase">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-base-content/40">
                <User size={16} />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="cyber_user"
                className="input input-bordered w-full pl-10 bg-base-100 rounded-xl focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </div>

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
                placeholder="Min 6 characters"
                className="input input-bordered w-full pl-10 bg-base-100 rounded-xl focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block rounded-xl font-bold mt-4 shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-transform duration-200"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-xs text-base-content/60 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="link link-primary font-bold">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
