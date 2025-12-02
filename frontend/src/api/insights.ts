// Mock insights API - uses localStorage
import { mockInsightsService } from '../services/mockData';

export interface InsightsSummary {
  total_entries: number;
  average_mood?: number;
  streak: number;
}

export interface MoodTrendData {
  date: string;
  average_mood?: number;
  entry_count: number;
}

export const insightsApi = {
  getSummary: async (): Promise<InsightsSummary> => {
    const data = await mockInsightsService.getSummary();
    return {
      total_entries: data.entry_count,
      average_mood: data.average_mood || undefined,
      streak: data.streak,
    };
  },

  getMoodTrend: async (days: number = 30): Promise<MoodTrendData[]> => {
    const data = await mockInsightsService.getMoodTrend(days);
    // Convert to expected format
    return data.map((item) => ({
      date: item.date,
      average_mood: item.mood,
      entry_count: 1,
    }));
  },
};
