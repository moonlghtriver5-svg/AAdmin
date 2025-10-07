'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Usage', path: '/', icon: '📊' },
    { name: 'Controls', path: '/controls', icon: '⚙️' },
    { name: 'Proxy Funnel', path: '/proxy-funnel', icon: '🔍' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center relative">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full border-2 border-white opacity-60" style={{ width: '16px', height: '16px', left: '-3.5px', top: '-3.5px' }}></div>
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full border-2 border-white opacity-30" style={{ width: '22px', height: '22px', left: '-6px', top: '-6px' }}></div>
            </div>
          </div>
          <div>
            <span className="text-xl font-semibold text-gray-800">ALICE AI</span>
            <p className="text-xs text-gray-500">Governance Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p className="font-medium">AI Governance Platform</p>
          <p className="mt-1">v2.1.0 • SOC2 Compliant</p>
          <p className="mt-2">© 2025 ALICE AI</p>
        </div>
      </div>
    </div>
  );
}
