'use client';

import { useState } from 'react';
import { mockUsers, mockModels } from '@/lib/mockData';

export default function ControlsPage() {
  const [users, setUsers] = useState(mockUsers);
  const [models] = useState(mockModels);

  const toggleModelForUser = (userId: string, modelId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.id === userId) {
          const hasModel = user.assignedModels.includes(modelId);
          return {
            ...user,
            assignedModels: hasModel
              ? user.assignedModels.filter(m => m !== modelId)
              : [...user.assignedModels, modelId],
          };
        }
        return user;
      })
    );
  };

  const updateTokenLimit = (userId: string, newLimit: number) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, tokenLimit: newLimit } : user
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">User Controls</h2>
        <p className="text-gray-600 mt-2">
          Manage user access to models and configure token limits
        </p>
      </div>

      {/* Controls table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                {models.map(model => (
                  <th
                    key={model.id}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {model.name}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token Limit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                      {user.department}
                    </span>
                  </td>
                  {models.map(model => (
                    <td key={model.id} className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={user.assignedModels.includes(model.id)}
                        onChange={() => toggleModelForUser(user.id, model.id)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={user.tokenLimit}
                      onChange={(e) => updateTokenLimit(user.id, parseInt(e.target.value))}
                      className="w-32 px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User details cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active models summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Models Overview</h3>
          <div className="space-y-3">
            {models.map(model => {
              const usersWithAccess = users.filter(u => u.assignedModels.includes(model.id)).length;
              return (
                <div key={model.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{model.name}</p>
                    <p className="text-xs text-gray-500">{model.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{usersWithAccess} users</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        model.enabled
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {model.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Token usage summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Usage Summary</h3>
          <div className="space-y-4">
            {users.map(user => {
              const usagePercent = (user.tokenUsed / user.tokenLimit) * 100;
              const isNearLimit = usagePercent > 80;

              return (
                <div key={user.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    <span className={`text-sm ${isNearLimit ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      {usagePercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isNearLimit ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
