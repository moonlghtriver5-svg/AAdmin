'use client';

import { useState, useEffect } from 'react';
import { type ProxyLog } from '@/lib/mockData';

export default function ProxyFunnelPage() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<ProxyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<ProxyLog | null>(null);
  const [filterFlagged, setFilterFlagged] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data.map((log: any) => ({
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

  const filteredLogs = logs.filter(log => {
    const matchesFlag = !filterFlagged || log.flagged;
    const matchesSearch =
      !searchQuery ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.modelId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFlag && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading proxy logs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Proxy Funnel</h2>
        <p className="text-gray-600 mt-2">
          Audit trail of all AI interactions for compliance and security
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by user, prompt, or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterFlagged}
              onChange={(e) => setFilterFlagged(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Show only flagged</span>
          </label>
        </div>

        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
          <span>Total interactions: {logs.length}</span>
          <span>•</span>
          <span>Flagged: {logs.filter(l => l.flagged).length}</span>
          <span>•</span>
          <span>Showing: {filteredLogs.length}</span>
        </div>
      </div>

      {/* Logs table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {!mounted || loading ? (
          <div className="p-6 h-96 animate-pulse bg-gray-50" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prompt Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tokens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.timestamp.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full">
                      {log.modelId}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                    {log.prompt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.tokensUsed.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.flagged ? (
                      <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full flex items-center space-x-1 w-fit">
                        <span>🚩</span>
                        <span>Flagged</span>
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full">
                        Clear
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Interaction Details</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">User</p>
                  <p className="text-lg font-medium text-gray-900">{selectedLog.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Model</p>
                  <p className="text-lg font-medium text-gray-900">{selectedLog.modelId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timestamp</p>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedLog.timestamp.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tokens Used</p>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedLog.tokensUsed.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Flag status */}
              {selectedLog.flagged && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🚩</span>
                    <div>
                      <p className="font-semibold text-red-900">Flagged for Review</p>
                      <p className="text-sm text-red-700 mt-1">{selectedLog.flagReason}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Prompt */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">User Prompt</p>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedLog.prompt}</p>
                </div>
              </div>

              {/* Response */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Model Response</p>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedLog.response}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
