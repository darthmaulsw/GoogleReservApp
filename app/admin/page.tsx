"use client";
import React, { useState, useEffect } from "react";
import { AdminSettings, CustomDay, TimeSlot } from "../../lib/adminSettings";

const defaultSettings: AdminSettings = {
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

export default function AdminPanel() {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [showAddCustomDay, setShowAddCustomDay] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [newCustomDay, setNewCustomDay] = useState<CustomDay>({
    date: "",
    enabled: true,
    timeSlots: [{ start: "09:00", end: "21:00" }],
    note: ""
  });

  useEffect(() => {
    // Load settings from localStorage (in a real app, this would be from a database)
    const savedSettings = localStorage.getItem('restaurantSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (!parsed.customDays) {
          parsed.customDays = [];
        }
        // Ensure new fields exist for backward compatibility
        if (!parsed.maxAccommodation) {
          parsed.maxAccommodation = 20;
        }
        if (!parsed.avgReservationLength) {
          parsed.avgReservationLength = 90;
        }
        setSettings(parsed);
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('restaurantSettings', JSON.stringify(settings));
    setSaved(true);
    setHasChanges(false);
    setTimeout(() => setSaved(false), 2000);
  };

  // Track changes to settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('restaurantSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        const hasSettingsChanged = JSON.stringify(parsed) !== JSON.stringify(settings);
        setHasChanges(hasSettingsChanged);
      } catch {
        setHasChanges(true);
      }
    } else {
      setHasChanges(true);
    }
  }, [settings]);

  const updateMaxPeople = (value: number) => {
    setSettings(prev => ({ ...prev, maxPeople: value }));
  };

  const updateMaxAccommodation = (value: number) => {
    setSettings(prev => ({ ...prev, maxAccommodation: value }));
  };

  const updateAvgReservationLength = (value: number) => {
    setSettings(prev => ({ ...prev, avgReservationLength: value }));
  };

  const toggleDay = (day: keyof AdminSettings['days']) => {
    setSettings(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          enabled: !prev.days[day].enabled
        }
      }
    }));
  };

  const updateTimeSlot = (day: keyof AdminSettings['days'], index: number, field: 'start' | 'end', value: string) => {
    setSettings(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          timeSlots: prev.days[day].timeSlots.map((slot, i) => 
            i === index ? { ...slot, [field]: value } : slot
          )
        }
      }
    }));
  };

  const addTimeSlot = (day: keyof AdminSettings['days']) => {
    setSettings(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          timeSlots: [...prev.days[day].timeSlots, { start: "09:00", end: "21:00" }]
        }
      }
    }));
  };

  const removeTimeSlot = (day: keyof AdminSettings['days'], index: number) => {
    setSettings(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          timeSlots: prev.days[day].timeSlots.filter((_, i) => i !== index)
        }
      }
    }));
  };

  // Custom day functions
  const addCustomDay = () => {
    if (newCustomDay.date) {
      setSettings(prev => ({
        ...prev,
        customDays: [...prev.customDays, { ...newCustomDay }]
      }));
      setNewCustomDay({
        date: "",
        enabled: true,
        timeSlots: [{ start: "09:00", end: "21:00" }],
        note: ""
      });
      setShowAddCustomDay(false);
    }
  };

  const updateCustomDayTimeSlot = (date: string, index: number, field: 'start' | 'end', value: string) => {
    setSettings(prev => ({
      ...prev,
      customDays: prev.customDays.map(customDay => 
        customDay.date === date 
          ? {
              ...customDay,
              timeSlots: customDay.timeSlots.map((slot, i) => 
                i === index ? { ...slot, [field]: value } : slot
              )
            }
          : customDay
      )
    }));
  };

  const addCustomDayTimeSlot = (date: string) => {
    setSettings(prev => ({
      ...prev,
      customDays: prev.customDays.map(customDay => 
        customDay.date === date 
          ? {
              ...customDay,
              timeSlots: [...customDay.timeSlots, { start: "09:00", end: "21:00" }]
            }
          : customDay
      )
    }));
  };

  const removeCustomDayTimeSlot = (date: string, index: number) => {
    setSettings(prev => ({
      ...prev,
      customDays: prev.customDays.map(customDay => 
        customDay.date === date 
          ? {
              ...customDay,
              timeSlots: customDay.timeSlots.filter((_, i) => i !== index)
            }
          : customDay
      )
    }));
  };

  const toggleCustomDay = (date: string) => {
    setSettings(prev => ({
      ...prev,
      customDays: prev.customDays.map(customDay => 
        customDay.date === date 
          ? { ...customDay, enabled: !customDay.enabled }
          : customDay
      )
    }));
  };

  const removeCustomDay = (date: string) => {
    setSettings(prev => ({
      ...prev,
      customDays: prev.customDays.filter(customDay => customDay.date !== date)
    }));
  };

  const updateCustomDayNote = (date: string, note: string) => {
    setSettings(prev => ({
      ...prev,
      customDays: prev.customDays.map(customDay => 
        customDay.date === date 
          ? { ...customDay, note }
          : customDay
      )
    }));
  };

  const dayNames = {
    monday: "Monday",
    tuesday: "Tuesday", 
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday"
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <main className="min-h-screen bg-[#cce6f4] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#175676] mb-8">Admin Panel</h1>
          
          {/* Maximum People Setting */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#175676] mb-4">Reservation Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#175676] mb-1">Maximum People per Reservation:</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={settings.maxPeople}
                  onChange={(e) => updateMaxPeople(parseInt(e.target.value))}
                  className="w-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-[#175676] font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#175676] mb-1">Maximum Accommodation (Total Restaurant Capacity):</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={settings.maxAccommodation}
                  onChange={(e) => updateMaxAccommodation(parseInt(e.target.value))}
                  className="w-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-[#175676] font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#175676] mb-1">Average Reservation Length (minutes):</label>
                <input
                  type="number"
                  min="15"
                  max="180"
                  value={settings.avgReservationLength}
                  onChange={(e) => updateAvgReservationLength(parseInt(e.target.value))}
                  className="w-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-[#175676] font-medium"
                />
              </div>
            </div>
          </div>

          {/* Custom Days Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#175676]">Custom Days (Override Regular Schedule)</h2>
              <button
                onClick={() => setShowAddCustomDay(true)}
                className="px-4 py-2 bg-[#175676] text-white rounded-lg hover:bg-[#124a63] transition-colors"
              >
                Add Custom Day
              </button>
            </div>

            {/* Add Custom Day Form */}
            {showAddCustomDay && (
              <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                <h3 className="text-lg font-medium text-[#175676] mb-3">Add Custom Day</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#175676] mb-1">Date:</label>
                    <input
                      type="date"
                      value={newCustomDay.date}
                      onChange={(e) => setNewCustomDay(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-[#175676] font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#175676] mb-1">Note (optional):</label>
                    <input
                      type="text"
                      placeholder="e.g., Holiday hours, Special event"
                      value={newCustomDay.note}
                      onChange={(e) => setNewCustomDay(prev => ({ ...prev, note: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-[#175676] font-medium"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={newCustomDay.enabled}
                      onChange={(e) => setNewCustomDay(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="w-4 h-4 text-[#175676] border-gray-300 rounded focus:ring-[#175676]"
                    />
                    <span className="text-[#175676]">Enable reservations for this date</span>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#175676]">Time Slots:</label>
                    {newCustomDay.timeSlots.map((slot, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => setNewCustomDay(prev => ({
                            ...prev,
                            timeSlots: prev.timeSlots.map((s, i) => 
                              i === index ? { ...s, start: e.target.value } : s
                            )
                          }))}
                          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-[#175676] font-medium"
                        />
                        <span className="text-[#175676]">to</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => setNewCustomDay(prev => ({
                            ...prev,
                            timeSlots: prev.timeSlots.map((s, i) => 
                              i === index ? { ...s, end: e.target.value } : s
                            )
                          }))}
                          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-[#175676] font-medium"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={addCustomDay}
                      className="px-4 py-2 bg-[#175676] text-white rounded-lg hover:bg-[#124a63] transition-colors"
                    >
                      Add Custom Day
                    </button>
                    <button
                      onClick={() => setShowAddCustomDay(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Days List */}
            <div className="space-y-4">
              {settings.customDays.map((customDay) => (
                <div key={customDay.date} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={customDay.enabled}
                        onChange={() => toggleCustomDay(customDay.date)}
                        className="w-4 h-4 text-[#175676] border-gray-300 rounded focus:ring-[#175676]"
                      />
                      <div>
                        <span className="text-lg font-medium text-[#175676]">{formatDate(customDay.date)}</span>
                        {customDay.note && (
                          <p className="text-sm text-[#64748b]">{customDay.note}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeCustomDay(customDay.date)}
                      className="px-2 py-1 bg-[#d62839] text-white rounded hover:bg-[#b91c1c] transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  {customDay.enabled && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#175676]">Time Slots:</span>
                        <button
                          onClick={() => addCustomDayTimeSlot(customDay.date)}
                          className="px-2 py-1 bg-[#175676] text-white rounded hover:bg-[#124a63] transition-colors text-sm"
                        >
                          Add Time Slot
                        </button>
                      </div>
                      {customDay.timeSlots.map((slot, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <label className="text-[#175676] text-sm">Start:</label>
                            <input
                              type="time"
                              value={slot.start}
                              onChange={(e) => updateCustomDayTimeSlot(customDay.date, index, 'start', e.target.value)}
                              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-[#175676] font-medium"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="text-[#175676] text-sm">End:</label>
                            <input
                              type="time"
                              value={slot.end}
                              onChange={(e) => updateCustomDayTimeSlot(customDay.date, index, 'end', e.target.value)}
                              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-[#175676] font-medium"
                            />
                          </div>
                          {customDay.timeSlots.length > 1 && (
                            <button
                              onClick={() => removeCustomDayTimeSlot(customDay.date, index)}
                              className="px-2 py-1 bg-[#d62839] text-white rounded hover:bg-[#b91c1c] transition-colors text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <div>
                        <label className="block text-sm font-medium text-[#175676] mb-1">Note:</label>
                        <input
                          type="text"
                          value={customDay.note || ""}
                          onChange={(e) => updateCustomDayNote(customDay.date, e.target.value)}
                          placeholder="Optional note for this day"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-[#175676] font-medium"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Days Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#175676] mb-4">Regular Weekly Schedule</h2>
            <div className="space-y-6">
              {(Object.keys(settings.days) as Array<keyof AdminSettings['days']>).map((day) => (
                <div key={day} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.days[day].enabled}
                        onChange={() => toggleDay(day)}
                        className="w-4 h-4 text-[#175676] border-gray-300 rounded focus:ring-[#175676]"
                      />
                      <span className="text-lg font-medium text-[#175676]">{dayNames[day]}</span>
                    </div>
                    {settings.days[day].enabled && (
                      <button
                        onClick={() => addTimeSlot(day)}
                        className="px-3 py-1 bg-[#175676] text-white rounded-lg hover:bg-[#124a63] transition-colors text-sm"
                      >
                        Add Time Slot
                      </button>
                    )}
                  </div>
                  
                  {settings.days[day].enabled && (
                    <div className="space-y-3">
                      {settings.days[day].timeSlots.map((slot, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <label className="text-[#175676] text-sm">Start:</label>
                            <input
                              type="time"
                              value={slot.start}
                              onChange={(e) => updateTimeSlot(day, index, 'start', e.target.value)}
                              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-[#175676] font-medium"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="text-[#175676] text-sm">End:</label>
                            <input
                              type="time"
                              value={slot.end}
                              onChange={(e) => updateTimeSlot(day, index, 'end', e.target.value)}
                              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-[#175676] font-medium"
                            />
                          </div>
                          {settings.days[day].timeSlots.length > 1 && (
                            <button
                              onClick={() => removeTimeSlot(day, index)}
                              className="px-2 py-1 bg-[#d62839] text-white rounded hover:bg-[#b91c1c] transition-colors text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>

      {/* Floating Save Button */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={saveSettings}
            className="px-6 py-3 bg-[#175676] text-white rounded-lg hover:bg-[#124a63] transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            Save Settings
          </button>
        </div>
      )}

      {/* Success Message */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-out">
          <div className="px-6 py-3 bg-[#4BA3C3] text-white rounded-lg font-medium shadow-lg">
            Successfully Saved
          </div>
        </div>
      )}
    </main>
  );
} 