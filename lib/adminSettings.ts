// Admin settings management utilities

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DaySettings {
  enabled: boolean;
  timeSlots: TimeSlot[];
}

export interface CustomDay {
  date: string; // YYYY-MM-DD format
  enabled: boolean;
  timeSlots: TimeSlot[];
  note?: string; // Optional note for the custom day
}

export interface AdminSettings {
  maxPeople: number;
  maxAccommodation: number;
  avgReservationLength: number;
  days: {
    monday: DaySettings;
    tuesday: DaySettings;
    wednesday: DaySettings;
    thursday: DaySettings;
    friday: DaySettings;
    saturday: DaySettings;
    sunday: DaySettings;
  };
  customDays: CustomDay[];
}

export const defaultSettings: AdminSettings = {
  maxPeople: 20,
  maxAccommodation: 20,
  avgReservationLength: 90,
  days: {
    monday: {
      enabled: true,
      timeSlots: [{ start: "09:00", end: "21:00" }]
    },
    tuesday: {
      enabled: true,
      timeSlots: [{ start: "09:00", end: "21:00" }]
    },
    wednesday: {
      enabled: true,
      timeSlots: [{ start: "09:00", end: "21:00" }]
    },
    thursday: {
      enabled: true,
      timeSlots: [{ start: "09:00", end: "21:00" }]
    },
    friday: {
      enabled: true,
      timeSlots: [{ start: "09:00", end: "21:00" }]
    },
    saturday: {
      enabled: true,
      timeSlots: [{ start: "09:00", end: "21:00" }]
    },
    sunday: {
      enabled: true,
      timeSlots: [{ start: "09:00", end: "21:00" }]
    }
  },
  customDays: []
};

export const getAdminSettings = (): AdminSettings => {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }
  
  const savedSettings = localStorage.getItem('restaurantSettings');
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      // Ensure customDays exists for backward compatibility
      if (!parsed.customDays) {
        parsed.customDays = [];
      }
      return parsed;
    } catch {
      return defaultSettings;
    }
  }
  return defaultSettings;
};

export const getMaxPeople = (): number => {
  return getAdminSettings().maxPeople;
};

export const getMaxAccommodation = (): number => {
  return getAdminSettings().maxAccommodation;
};

export const getAvgReservationLength = (): number => {
  return getAdminSettings().avgReservationLength;
};

export const getDaySettings = (dayOfWeek: number): DaySettings => {
  const settings = getAdminSettings();
  const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayKey = dayKeys[dayOfWeek] as keyof AdminSettings['days'];
  return settings.days[dayKey];
};

export const getCustomDaySettings = (date: Date): CustomDay | null => {
  const settings = getAdminSettings();
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  return settings.customDays.find(customDay => customDay.date === dateString) || null;
};

export const generateTimeSlotsForDay = (dayOfWeek: number): string[] => {
  const daySettings = getDaySettings(dayOfWeek);
  
  if (!daySettings.enabled) {
    return [];
  }

  const slots: string[] = [];
  
  daySettings.timeSlots.forEach(timeSlot => {
    const startHour = parseInt(timeSlot.start.split(':')[0]);
    const startMinute = parseInt(timeSlot.start.split(':')[1]);
    const endHour = parseInt(timeSlot.end.split(':')[0]);
    const endMinute = parseInt(timeSlot.end.split(':')[1]);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (
      currentHour < endHour || 
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      slots.push(timeString);
      
      // Add 15 minutes
      currentMinute += 15;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour += 1;
      }
    }
  });
  
  return slots;
};

export const generateTimeSlotsForDate = (date: Date): string[] => {
  // First check for custom day settings
  const customDay = getCustomDaySettings(date);
  
  if (customDay) {
    if (!customDay.enabled) {
      return [];
    }
    
    const slots: string[] = [];
    
    customDay.timeSlots.forEach(timeSlot => {
      const startHour = parseInt(timeSlot.start.split(':')[0]);
      const startMinute = parseInt(timeSlot.start.split(':')[1]);
      const endHour = parseInt(timeSlot.end.split(':')[0]);
      const endMinute = parseInt(timeSlot.end.split(':')[1]);
      
      let currentHour = startHour;
      let currentMinute = startMinute;
      
      while (
        currentHour < endHour || 
        (currentHour === endHour && currentMinute < endMinute)
      ) {
        const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        
        slots.push(timeString);
        
        // Add 15 minutes
        currentMinute += 15;
        if (currentMinute >= 60) {
          currentMinute = 0;
          currentHour += 1;
        }
      }
    });
    
    return slots;
  }
  
  // Fall back to regular day settings
  const dayOfWeek = date.getDay();
  return generateTimeSlotsForDay(dayOfWeek);
}; 