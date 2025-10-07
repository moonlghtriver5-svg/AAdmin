'use client';

import { useState, useEffect, useMemo } from 'react';
import { mockUsers, type User, type ProxyLog } from '@/lib/mockData';
import { getMessagesByDay, getMessagesByHour, getModelDistribution, getTokenUsageOverTime, type TimeRange } from '@/lib/dataHelpers';

interface UsageChartsProps {
  logs: ProxyLog[];
  selectedUser: User | null | undefined;
  timeRange: TimeRange;
}

export default function UsageCharts({ logs, selectedUser, timeRange }: UsageChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get time-series data based on range
  const timeSeriesData = useMemo(() => {
    if (timeRange === 'hourly') {
      return getMessagesByHour(logs, 24);
    } else {
      const days = timeRange === 'daily' ? 7 : timeRange === 'weekly' ? 30 : 90;
      return getMessagesByDay(logs, days);
    }
  }, [logs, timeRange]);

  const modelDistribution = useMemo(() => getModelDistribution(logs), [logs]);
  const tokenData = useMemo(() => {
    const days = timeRange === 'daily' ? 7 : timeRange === 'weekly' ? 30 : 90;
    return getTokenUsageOverTime(logs, timeRange === 'hourly' ? 24 : days);
  }, [logs, timeRange]);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-96 animate-pulse" />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-96 animate-pulse" />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-96 animate-pulse" />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-96 animate-pulse" />
      </div>
    );
  }

  const totalMessages = logs.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Messages over time chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Messages Over Time
        </h3>
        <div className="space-y-3">
          {timeSeriesData.map((item, index) => {
            const maxCount = Math.max(...timeSeriesData.map(d => 'count' in d ? d.count : 0));
            const count = 'count' in item ? item.count : 0;
            const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const label = 'date' in item
              ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'hour' in item ? item.hour : '';

            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div
                    className="bg-blue-500 h-6 rounded-full transition-all duration-300"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model distribution chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Model Distribution
        </h3>
        <div className="space-y-4">
          {Object.entries(modelDistribution)
            .sort((a, b) => b[1] - a[1])
            .map(([modelId, count], index) => {
              const modelNames: Record<string, string> = {
                'gpt-4.1': 'GPT-4.1',
                'claude-sonnet-4': 'Claude Sonnet 4',
                'qwen-2.5-vl-72b': 'Qwen 2.5 VL 72B',
                'qwen-3-8b': 'Qwen 3 8B',
                'gemini-2.5-pro': 'Gemini 2.5 Pro',
              };
              const colors = ['bg-purple-500', 'bg-orange-500', 'bg-indigo-500', 'bg-blue-500', 'bg-green-500'];

              return (
                <ModelBar
                  key={modelId}
                  name={modelNames[modelId] || modelId}
                  value={count}
                  total={totalMessages}
                  color={colors[index % colors.length]}
                />
              );
            })}
        </div>
      </div>

      {/* Token usage over time */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Token Usage Trend
        </h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {tokenData.map((item, index) => {
            const maxTokens = Math.max(...tokenData.map(d => d.tokens), 1);
            const height = (item.tokens / maxTokens) * 100;
            const label = new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex items-end justify-center" style={{ height: '240px' }}>
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-md transition-all duration-300"
                    style={{ height: `${height}%` }}
                    title={`${item.tokens.toLocaleString()} tokens`}
                  />
                </div>
                <span className="text-xs text-gray-600 mt-2">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top users (only show when viewing all) */}
      {!selectedUser && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Users by Token Usage
          </h3>
          <div className="space-y-3">
            {mockUsers
              .sort((a, b) => b.tokenUsed - a.tokenUsed)
              .slice(0, 5)
              .map((user) => {
                const usagePercent = ((user.tokenUsed / user.tokenLimit) * 100).toFixed(0);

                return (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {user.tokenUsed.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{usagePercent}% of limit</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

interface ModelBarProps {
  name: string;
  value: number;
  total: number;
  color: string;
}

function ModelBar({ name, value, total, color }: ModelBarProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className="text-sm text-gray-600">
          {value} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
