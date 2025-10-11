import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);
    
    if (!success) {
      setError('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  // Demo accounts for quick access
  const demoAccounts = [
    { email: 'admin@company.com', role: 'Admin', color: 'bg-purple-50 text-purple-700' },
    { email: 'staff@company.com', role: 'Staff', color: 'bg-blue-50 text-blue-700' },
    { email: 'partner@company.com', role: 'Partner', color: 'bg-green-50 text-green-700' },
    { email: 'client@company.com', role: 'Client', color: 'bg-orange-50 text-orange-700' },
  ];

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold mb-4">TaskFlow</h1>
            <p className="text-xl text-blue-100">
              Streamline your client collaboration and task management
            </p>
          </div>
          
          <div className="space-y-4 text-left bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Key Features:</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                <span className="text-blue-100">Role-based access control</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                <span className="text-blue-100">Automated service templates</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                <span className="text-blue-100">Document management hub</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                <span className="text-blue-100">Real-time notifications</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-600 mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                to="/forgot-password" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Demo accounts */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">Demo Accounts (password: password)</p>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    onClick={() => handleDemoLogin(account.email)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-80 ${account.color}`}
                  >
                    {account.role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}