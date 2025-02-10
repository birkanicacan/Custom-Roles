import React from 'react';
import { HomeIcon, UsersIcon, ShieldCheckIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { useLocation, Link } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { name: 'General', icon: HomeIcon, path: '/general' },
    { name: 'People', icon: UsersIcon, path: '/people' },
    { name: 'Security', icon: ShieldCheckIcon, path: '/security' },
    { name: 'Audit log', icon: ClipboardDocumentListIcon, path: '/audit-log' },
  ];

  return (
    <div className="w-64 min-h-screen border-r border-gray-200">
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#ff7b37] rounded-md flex items-center justify-center">
            <span className="text-white font-bold">L</span>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-900">Lumi Labs Organization</h2>
            <p className="text-xs text-gray-500">Enterprise plan · 210 members</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-2 text-sm ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3 text-gray-400" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar; 