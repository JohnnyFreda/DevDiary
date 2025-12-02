// Mock calendar API - uses localStorage
import { mockCalendarService } from '../services/mockData';

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
    const data = await mockCalendarService.getMonth(year, month, filters);
    
    // Convert days object to array format
    const days: CalendarDay[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = data.days[day];
      
      if (dayData) {
        days.push({
          date: dateStr,
          entry_count: dayData.entry_count || 0,
          average_mood: dayData.mood || undefined,
        });
      } else {
        days.push({
          date: dateStr,
          entry_count: 0,
          average_mood: undefined,
        });
      }
    }
    
    return {
      year: data.year,
      month: data.month,
      days,
    };
  },
};
