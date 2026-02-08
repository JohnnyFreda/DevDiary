import { apiClient } from './client';

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
    const { data } = await apiClient.get<{ total_entries: number; average_mood?: number | null; streak: number }>('/insights/summary');
    return {
      total_entries: data.total_entries ?? 0,
      average_mood: data.average_mood ?? undefined,
      streak: data.streak ?? 0,
    };
  },

  getMoodTrend: async (days: number = 30): Promise<MoodTrendData[]> => {
    const { data } = await apiClient.get<Array<{ date: string; average_mood?: number | null; entry_count: number }>>('/insights/mood-trend', { params: { days } });
    return (Array.isArray(data) ? data : []).map((item) => ({
      date: String(item.date),
      average_mood: item.average_mood ?? undefined,
      entry_count: item.entry_count ?? 0,
    }));
  },
};
