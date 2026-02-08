import { apiClient } from './client';

export interface CalendarDay {
  date: string;
  entry_count: number;
  average_mood?: number;
}

export interface CalendarMonthResponse {
  year: number;
  month: number;
  days: CalendarDay[];
}

export const calendarApi = {
  getMonth: async (
    year: number,
    month: number,
    filters?: { project_id?: number; tag?: string }
  ): Promise<CalendarMonthResponse> => {
    const params: Record<string, number | string> = { year, month };
    if (filters?.project_id != null) params.project_id = filters.project_id;
    if (filters?.tag != null) params.tag = filters.tag;
    const { data } = await apiClient.get<{ year: number; month: number; days: Array<{ date: string; entry_count: number; average_mood?: number | null }> }>('/calendar/month', { params });
    const days: CalendarDay[] = (data.days ?? []).map((d) => ({
      date: String(d.date),
      entry_count: d.entry_count ?? 0,
      average_mood: d.average_mood ?? undefined,
    }));
    return {
      year: data.year,
      month: data.month,
      days,
    };
  },
};
