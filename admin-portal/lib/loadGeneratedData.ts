import fs from 'fs';
import path from 'path';
import { type ProxyLog } from './mockData';

export function loadGeneratedLogs(): ProxyLog[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'generatedLogs.json');

    if (!fs.existsSync(filePath)) {
      console.warn('Generated logs file not found, using fallback data');
      return [];
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const logs = JSON.parse(fileContent);

    // Convert timestamp strings back to Date objects
    return logs.map((log: Record<string, unknown>) => ({
      ...log,
      timestamp: new Date(log.timestamp as string),
    }));
  } catch (error) {
    console.error('Error loading generated logs:', error);
    return [];
  }
}
