import { type ProxyLog } from './mockData';

export type TimeRange = 'hourly' | 'daily' | 'weekly' | 'monthly';

export function getLogsForTimeRange(logs: ProxyLog[], range: TimeRange): ProxyLog[] {
  const now = new Date();
  let cutoffTime: Date;

  switch (range) {
    case 'hourly':
      cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
      break;
    case 'daily':
      cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
      break;
    case 'weekly':
      cutoffTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
      break;
    case 'monthly':
      cutoffTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // Last 90 days
      break;
  }

  return logs.filter(log => log.timestamp >= cutoffTime);
}

export function calculateStats(logs: ProxyLog[], userId?: string) {
  const filteredLogs = userId ? logs.filter(l => l.userId === userId) : logs;

  return {
    totalMessages: filteredLogs.length,
    totalTokens: filteredLogs.reduce((sum, log) => sum + log.tokensUsed, 0),
    flaggedCount: filteredLogs.filter(log => log.flagged).length,
    activeUsers: userId ? 1 : new Set(filteredLogs.map(l => l.userId)).size,
  };
}

export function getModelDistribution(logs: ProxyLog[]) {
  const distribution: Record<string, number> = {};

  logs.forEach(log => {
    distribution[log.modelId] = (distribution[log.modelId] || 0) + 1;
  });

  return distribution;
}

export function getMessagesByDay(logs: ProxyLog[], days: number = 7) {
  const now = new Date();
  const dayData: { date: string; count: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const count = logs.filter(
      log => log.timestamp >= date && log.timestamp < nextDay
    ).length;

    dayData.push({
      date: date.toISOString().split('T')[0],
      count,
    });
  }

  return dayData;
}

export function getMessagesByHour(logs: ProxyLog[], hours: number = 24) {
  const now = new Date();
  const hourData: { hour: string; count: number }[] = [];

  for (let i = hours - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setHours(date.getHours() - i, 0, 0, 0);

    const nextHour = new Date(date);
    nextHour.setHours(nextHour.getHours() + 1);

    const count = logs.filter(
      log => log.timestamp >= date && log.timestamp < nextHour
    ).length;

    hourData.push({
      hour: date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false }),
      count,
    });
  }

  return hourData;
}

export function getTokenUsageOverTime(logs: ProxyLog[], points: number = 7) {
  const now = new Date();
  const data: { date: string; tokens: number }[] = [];

  for (let i = points - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const tokens = logs
      .filter(log => log.timestamp >= date && log.timestamp < nextDay)
      .reduce((sum, log) => sum + log.tokensUsed, 0);

    data.push({
      date: date.toISOString().split('T')[0],
      tokens,
    });
  }

  return data;
}

export function calculateGrowth(current: number, previous: number): { value: string; isPositive: boolean } {
  if (previous === 0) return { value: '+100%', isPositive: true };

  const growth = ((current - previous) / previous) * 100;
  const isPositive = growth >= 0;

  return {
    value: `${isPositive ? '+' : ''}${growth.toFixed(1)}%`,
    isPositive,
  };
}
