'use client';

import { useState, useEffect, useMemo } from 'react';
import { mockUsers } from '@/lib/mockData';

interface Agent {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface AgentUsage {
  agentId: string;
  agentName: string;
  userId: string;
  userName: string;
  modelUsed: string;
  tokensUsed: number;
  tasksExecuted: number;
  timestamp: Date;
}

const AGENTS: Agent[] = [
  { id: 'gma-agent', name: 'GMA (Global Macro Agent)', description: 'Global macro analysis and economic intelligence', enabled: true },
  { id: 'prd-agent', name: 'PRD Agent', description: 'Product Requirements Document generator', enabled: true },
  { id: 'chart-builder', name: 'Chart Builder Agent', description: 'Creates visualizations from data', enabled: true },
  { id: 'pipelines-agent', name: 'Pipelines Agent', description: 'Manages data processing pipelines', enabled: true },
  { id: 'chart-extractor', name: 'Chart/Table Extractor Agent', description: 'Extracts data from charts and tables', enabled: true },
  { id: 'report-builder', name: 'Report Builder Agent', description: 'Generates comprehensive reports', enabled: true },
];

// Mock agent usage data
const generateAgentUsage = (): AgentUsage[] => {
  const usage: AgentUsage[] = [];
  const now = new Date();

  // Generate usage data for the last 7 days
  for (let day = 0; day < 7; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() - day);

    AGENTS.forEach(agent => {
      // GMA agent has higher usage
      const isGMA = agent.id === 'gma-agent';
      const numUsers = isGMA ? 8 : Math.floor(Math.random() * 5) + 1;
      const usersSubset = mockUsers.slice(0, numUsers);

      usersSubset.forEach(user => {
        const models = ['gpt-4.1', 'claude-sonnet-4', 'gemini-2.5-pro', 'qwen-2.5-vl-72b'];
        const randomModel = models[Math.floor(Math.random() * models.length)];

        usage.push({
          agentId: agent.id,
          agentName: agent.name,
          userId: user.id,
          userName: user.name,
          modelUsed: randomModel,
          tokensUsed: isGMA
            ? Math.floor(Math.random() * 2000000) + 1500000  // 1.5M - 3.5M tokens per entry
            : Math.floor(Math.random() * 5000) + 1000,
          tasksExecuted: isGMA
            ? Math.floor(Math.random() * 100) + 50  // 50-150 tasks per entry
            : Math.floor(Math.random() * 10) + 1,
          timestamp: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000),
        });
      });
    });
  }

  return usage.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export default function AgentsPage() {
  const [agents] = useState<Agent[]>(AGENTS);
  const [agentUsage] = useState<AgentUsage[]>(generateAgentUsage());
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [userPermissions, setUserPermissions] = useState<Record<string, string[]>>(() => {
    // Initialize with all users having access to all agents
    const permissions: Record<string, string[]> = {};
    mockUsers.forEach(user => {
      permissions[user.id] = agents.map(a => a.id);
    });
    return permissions;
  });

  // Calculate agent statistics
  const agentStats = useMemo(() => {
    const filteredUsage = selectedAgent === 'all'
      ? agentUsage
      : agentUsage.filter(u => u.agentId === selectedAgent);

    const stats = agents.map(agent => {
      const agentData = filteredUsage.filter(u => u.agentId === agent.id);
      const uniqueUsers = new Set(agentData.map(u => u.userId)).size;
      const totalTokens = agentData.reduce((sum, u) => sum + u.tokensUsed, 0);
      const totalTasks = agentData.reduce((sum, u) => sum + u.tasksExecuted, 0);

      // Token usage by model
      const tokensByModel: Record<string, number> = {};
      agentData.forEach(usage => {
        tokensByModel[usage.modelUsed] = (tokensByModel[usage.modelUsed] || 0) + usage.tokensUsed;
      });

      return {
        agent,
        uniqueUsers,
        totalTokens,
        totalTasks,
        tokensByModel,
      };
    });

    return selectedAgent === 'all' ? stats : stats.filter(s => s.agent.id === selectedAgent);
  }, [agentUsage, agents, selectedAgent]);

  const toggleUserPermission = (userId: string, agentId: string) => {
    setUserPermissions(prev => {
      const userAgents = prev[userId] || [];
      const hasAccess = userAgents.includes(agentId);

      return {
        ...prev,
        [userId]: hasAccess
          ? userAgents.filter(id => id !== agentId)
          : [...userAgents, agentId],
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">AI Agents</h2>
        <p className="text-gray-600 mt-2">
          Manage agent permissions, monitor usage, and track performance
        </p>
      </div>

      {/* User permissions table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">User Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                {agents.map(agent => (
                  <th key={agent.id} className="text-center py-3 px-4 font-medium text-gray-700 text-sm">
                    {agent.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.department}</p>
                    </div>
                  </td>
                  {agents.map(agent => {
                    const hasAccess = userPermissions[user.id]?.includes(agent.id);
                    return (
                      <td key={agent.id} className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleUserPermission(user.id, agent.id)}
                          className={`w-10 h-6 rounded-full transition ${
                            hasAccess
                              ? 'bg-blue-600'
                              : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition transform ${
                              hasAccess ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Agent
        </label>
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
        >
          <option value="all">All Agents</option>
          {agents.map(agent => (
            <option key={agent.id} value={agent.id}>{agent.name}</option>
          ))}
        </select>
      </div>

      {/* Agent statistics cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {agentStats.map(({ agent, uniqueUsers, totalTokens, totalTasks }) => (
          <div key={agent.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{agent.description}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                agent.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {agent.enabled ? 'Active' : 'Inactive'}
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <div>
                <p className="text-sm text-gray-600">Users</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueUsers}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tokens</p>
                <p className="text-2xl font-bold text-gray-900">{totalTokens.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tasks Executed</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Token usage by model */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Token Usage by Model</h3>
        <div className="space-y-4">
          {agentStats.map(({ agent, tokensByModel }) => {
            const totalTokens = Object.values(tokensByModel).reduce((sum, val) => sum + val, 0);
            if (totalTokens === 0) return null;

            return (
              <div key={agent.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <h4 className="font-medium text-gray-900 mb-3">{agent.name}</h4>
                <div className="space-y-2">
                  {Object.entries(tokensByModel)
                    .sort(([, a], [, b]) => b - a)
                    .map(([model, tokens]) => {
                      const percentage = (tokens / totalTokens) * 100;
                      return (
                        <div key={model}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">{model}</span>
                            <span className="text-gray-900 font-medium">{tokens.toLocaleString()} tokens</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
