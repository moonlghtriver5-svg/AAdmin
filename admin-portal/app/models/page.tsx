'use client';

import { useState } from 'react';
import BenchmarksTab from './BenchmarksTab';
import CostsTab from './CostsTab';

type Tab = 'benchmarks' | 'costs';

export default function ModelsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('benchmarks');

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Models</h2>
        <p className="text-gray-600 mt-2">
          View model benchmarks, configure pricing, and track costs
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'benchmarks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📈 Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('costs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'costs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            💰 Costs
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'benchmarks' && <BenchmarksTab />}
        {activeTab === 'costs' && <CostsTab />}
      </div>
    </div>
  );
}
