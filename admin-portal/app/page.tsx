'use client';

import { useState, useMemo, useEffect } from 'react';
import { mockUsers, type ProxyLog } from '@/lib/mockData';
import UsageCharts from '@/components/UsageCharts';
import UserSelector from '@/components/UserSelector';
import { getLogsForTimeRange, calculateStats, calculateGrowth, type TimeRange } from '@/lib/dataHelpers';

export default function Home() {
  const [selectedUserId, setSelectedUserId] = useState<string | 'all'>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [allLogs, setAllLogs] = useState<ProxyLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch logs from API on mount
  useEffect(() => {
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => {
        setAllLogs(data.map((log: ProxyLog) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        })));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load logs:', err);
        setLoading(false);
      });
  }, []);

  const selectedUser = selectedUserId === 'all'
    ? null
    : mockUsers.find(u => u.id === selectedUserId);

  // Get logs for selected time range and filter by user
  const currentLogs = useMemo(() => {
    const timeFilteredLogs = getLogsForTimeRange(allLogs, timeRange);
    if (selectedUserId === 'all') {
      return timeFilteredLogs;
    }
    return timeFilteredLogs.filter(log => log.userId === selectedUserId);
  }, [allLogs, timeRange, selectedUserId]);

  // Calculate stats for current period
  const currentStats = useMemo(() =>
    calculateStats(currentLogs, selectedUser?.id),
    [currentLogs, selectedUser]
  );

  // Get previous period logs for growth calculation
  const previousLogs = useMemo(() => {
    const currentPeriodLogs = getLogsForTimeRange(allLogs, timeRange);
    if (currentPeriodLogs.length === 0) return [];
    const cutoff = new Date(Math.min(...currentPeriodLogs.map(l => l.timestamp.getTime())));

    return allLogs.filter(log => {
      const logTime = log.timestamp.getTime();
      const diff = cutoff.getTime() - logTime;
      return diff > 0 && diff < (24 * 60 * 60 * 1000 * (timeRange === 'hourly' ? 1 : timeRange === 'daily' ? 7 : timeRange === 'weekly' ? 30 : 90));
    });
  }, [allLogs, timeRange]);

  const previousStats = useMemo(() =>
    calculateStats(previousLogs, selectedUser?.id),
    [previousLogs, selectedUser]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Calculate growth
  const messagesGrowth = calculateGrowth(currentStats.totalMessages, previousStats.totalMessages);
  const tokensGrowth = calculateGrowth(currentStats.totalTokens, previousStats.totalTokens);
  const usersGrowth = calculateGrowth(currentStats.activeUsers, previousStats.activeUsers);
  const flaggedGrowth = calculateGrowth(currentStats.flaggedCount, previousStats.flaggedCount);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Usage Analytics</h2>
          <p className="text-gray-600 mt-2">Monitor AI model usage across all users and models</p>
        </div>

        {/* Time range selector */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
        >
          <option value="hourly">Last 24 Hours</option>
          <option value="daily">Last 7 Days</option>
          <option value="weekly">Last 30 Days</option>
          <option value="monthly">Last 90 Days</option>
        </select>
      </div>

      {/* User selector */}
      <UserSelector
        selectedUserId={selectedUserId}
        onUserChange={setSelectedUserId}
      />

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Messages"
          value={currentStats.totalMessages.toLocaleString()}
          change={messagesGrowth.value}
          trend={messagesGrowth.isPositive ? "up" : "down"}
        />
        <StatCard
          title="Total Tokens Used"
          value={currentStats.totalTokens.toLocaleString()}
          change={tokensGrowth.value}
          trend={tokensGrowth.isPositive ? "up" : "down"}
        />
        <StatCard
          title="Active Users"
          value={currentStats.activeUsers.toString()}
          change={usersGrowth.value}
          trend={usersGrowth.isPositive ? "up" : "down"}
        />
        <StatCard
          title="Flagged Interactions"
          value={currentStats.flaggedCount.toString()}
          change={flaggedGrowth.value}
          trend="neutral"
        />
      </div>

      {/* Usage charts */}
      <UsageCharts
        logs={currentLogs}
        selectedUser={selectedUser}
        timeRange={timeRange}
      />

      {/* User detail view */}
      {selectedUser && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">User Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-lg font-medium text-gray-900">{selectedUser.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-medium text-gray-900">{selectedUser.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="text-lg font-medium text-gray-900">{selectedUser.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Token Usage</p>
              <div className="mt-1">
                <p className="text-lg font-medium text-gray-900">
                  {selectedUser.tokenUsed.toLocaleString()} / {selectedUser.tokenLimit.toLocaleString()}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(selectedUser.tokenUsed / selectedUser.tokenLimit) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Assigned Models</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedUser.assignedModels.map(model => (
                  <span
                    key={model}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {model}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

function StatCard({ title, value, change, trend }: StatCardProps) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className={`text-sm mt-2 ${trendColor}`}>{change} from last week</p>
    </div>
  );
}
