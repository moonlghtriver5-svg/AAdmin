'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // Clear token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; max-age=0';

    // Redirect to login
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* User info */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'admin@apex-ai.com'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user ? getInitials(user.name) : 'AU'}
              </span>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
