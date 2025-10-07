'use client';

import { mockUsers } from '@/lib/mockData';

interface UserSelectorProps {
  selectedUserId: string | 'all';
  onUserChange: (userId: string | 'all') => void;
}

export default function UserSelector({ selectedUserId, onUserChange }: UserSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-3">
        Select User
      </label>
      <select
        id="user-select"
        value={selectedUserId}
        onChange={(e) => onUserChange(e.target.value)}
        className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
        <option value="all">All Users</option>
        {mockUsers.map(user => (
          <option key={user.id} value={user.id}>
            {user.name} - {user.department}
          </option>
        ))}
      </select>
    </div>
  );
}
