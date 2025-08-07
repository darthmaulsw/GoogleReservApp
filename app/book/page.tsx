"use client";
import React, { useState, useRef, useEffect } from "react";
import { getMaxPeople, generateTimeSlotsForDate, getAvgReservationLength } from "../../lib/adminSettings";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Generate time slots for a specific date based on admin settings
const generateTimeSlotsForDateWithDisplay = (date: Date) => {
  const timeSlots = generateTimeSlotsForDate(date);
  
  return timeSlots.map(timeString => {
    const hour = parseInt(timeString.split(':')[0]);
    const minute = parseInt(timeString.split(':')[1]);
    const displayTime = `${hour > 12 ? hour - 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
    
    return { value: timeString, display: displayTime };
  });
};

export default function BookPage() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [selectedTime, setSelectedTime] = useState("");
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [maxPeople, setMaxPeople] = useState(20);
  const [avgReservationLength, setAvgReservationLength] = useState(90);
  const timePickerRef = useRef<HTMLDivElement>(null);
  
  // Booking form state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    specialRequests: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: ""
  });

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);

  // Load admin settings
  useEffect(() => {
    setMaxPeople(getMaxPeople());
    setAvgReservationLength(getAvgReservationLength());
  }, []);

  const handlePrevMonth = () => {
    const today = new Date();
    const currentMonthNum = today.getMonth();
    const currentYearNum = today.getFullYear();
    
    // Only allow going back if we're not already at the current month
    if (currentMonth > currentMonthNum || currentYear > currentYearNum) {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Only allow selection if the date is today or in the future
    if (clickedDate >= todayStart) {
      setSelectedDate(clickedDate);
      setSelectedTime(""); // Reset time when date changes
    }
  };

  const handlePeopleChange = (increment: boolean) => {
    if (increment && numberOfPeople < maxPeople) {
      setNumberOfPeople(numberOfPeople + 1);
    } else if (!increment && numberOfPeople > 1) {
      setNumberOfPeople(numberOfPeople - 1);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setTimePickerOpen(false);
  };

  // Close time picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setTimePickerOpen(false);
      }
    };

    if (timePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [timePickerOpen]);

  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === currentMonth && 
           today.getFullYear() === currentYear;
  };

  const isPastDate = (day: number) => {
    const dateToCheck = new Date(currentYear, currentMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dateToCheck < todayStart;
  };

  const isSelected = (day: number) => {
    return selectedDate &&
           selectedDate.getDate() === day &&
           selectedDate.getMonth() === currentMonth &&
           selectedDate.getFullYear() === currentYear;
  };

  // Validation functions
  const validateFullName = (name: string): string => {
    if (!name.trim()) return "Full name is required";
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 2) return "Please enter your full name (first and last name)";
    if (nameParts.some(part => part.length < 2)) return "Each name part must be at least 2 characters";
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return ""; // Phone is optional
    const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
    if (!phoneRegex.test(phone)) return "Please use format: (123) 456-7890";
    return "";
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limitedDigits = digits.slice(0, 10);
    
    // Format based on length
    if (limitedDigits.length === 0) return '';
    if (limitedDigits.length <= 3) return `(${limitedDigits}`;
    if (limitedDigits.length <= 6) return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`;
    return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
  };

  const validateForm = (): boolean => {
    const nameError = validateFullName(bookingForm.customerName);
    const emailError = validateEmail(bookingForm.customerEmail);
    const phoneError = validatePhone(bookingForm.customerPhone);

    setValidationErrors({
      customerName: nameError,
      customerEmail: emailError,
      customerPhone: phoneError
    });

    return !nameError && !emailError && !phoneError;
  };

  const handleBookTable = () => {
    if (selectedDate && selectedTime) {
      setShowBookingForm(true);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      if (!selectedDate || !selectedTime) {
        throw new Error("Date and time are required");
      }

      // Calculate end time using admin settings
      const startTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      startTime.setHours(hours, minutes, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + avgReservationLength); // Use admin setting

      // Create the event data
      const eventData = {
        summary: `Reservation for ${bookingForm.customerName} - ${numberOfPeople} people`,
        description: `Customer: ${bookingForm.customerName}\nEmail: ${bookingForm.customerEmail}\nPhone: ${bookingForm.customerPhone}\nNumber of People: ${numberOfPeople}${bookingForm.specialRequests ? `\nSpecial Requests: ${bookingForm.specialRequests}` : ''}`,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'UTC'
        }
        // Removed location field
      };

      console.log('Creating booking event:', eventData);

      // Call the API route to create the Google Calendar event
      const response = await fetch('/api/calendar/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Booking created successfully:', result);
        setSubmitStatus("success");
        
        // Reset form after successful booking
        setTimeout(() => {
          setShowBookingForm(false);
          setBookingForm({
            customerName: "",
            customerEmail: "",
            customerPhone: "",
            specialRequests: ""
          });
          setSelectedDate(null);
          setSelectedTime("");
          setNumberOfPeople(1);
          setSubmitStatus("idle");
          setValidationErrors({
            customerName: "",
            customerEmail: "",
            customerPhone: ""
          });
        }, 3000);
      } else {
        const errorData = await response.json();
        console.log('Booking error:', errorData);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get time slots for selected date
  const timeSlots = selectedDate ? generateTimeSlotsForDateWithDisplay(selectedDate) : [];

  return (
    <main className="flex items-center justify-center min-h-[80vh] bg-[#cce6f4]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#175676]">Book a Table</h1>
        
        {!showBookingForm ? (
          <>
            <div className="flex justify-between items-center mb-4">
              {(currentMonth !== today.getMonth() || currentYear !== today.getFullYear()) && (
                <button
                  className="px-2 py-1 rounded hover:bg-[#e6f3f8] text-[#175676] transition-colors"
                  onClick={handlePrevMonth}
                  aria-label="Previous Month"
                >
                  &lt;
                </button>
              )}
              {currentMonth === today.getMonth() && currentYear === today.getFullYear() && (
                <div className="w-8"></div>
              )}
              <span className="font-semibold text-[#175676]">
                {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })}
                {" "}
                {currentYear}
              </span>
              <button
                className="px-2 py-1 rounded hover:bg-[#e6f3f8] text-[#175676] transition-colors"
                onClick={handleNextMonth}
                aria-label="Next Month"
              >
                &gt;
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {dayNames.map((day) => (
                <div key={day} className="font-medium text-[#64748b]">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array(firstDayOfWeek)
                .fill(null)
                .map((_, i) => (
                  <div key={"empty-" + i}></div>
                ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const pastDate = isPastDate(day);
                const todayDate = isToday(day);
                const selected = isSelected(day);
                
                let buttonClass = "w-9 h-9 rounded-full flex items-center justify-center transition-colors";
                
                if (pastDate) {
                  buttonClass += " text-gray-300 cursor-not-allowed";
                } else if (selected) {
                  buttonClass += " bg-[#175676] text-white";
                } else if (todayDate) {
                  buttonClass += " bg-[#cce6f4] text-[#175676] hover:bg-[#e6f3f8] hover:text-[#175676]";
                } else {
                  buttonClass += " hover:bg-[#e6f3f8] text-[#175676]";
                }

                return (
                  <button
                    key={day}
                    className={buttonClass}
                    onClick={() => handleDateClick(day)}
                    disabled={pastDate}
                    title={pastDate ? "Cannot book past dates" : ""}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            
            {/* Number of People Counter */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#175676] mb-2">
                Number of People
              </label>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => handlePeopleChange(false)}
                  disabled={numberOfPeople <= 1}
                  className="w-8 h-8 rounded-full bg-[#e6f3f8] hover:bg-[#cce6f4] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-[#175676] transition-colors"
                >
                  -
                </button>
                <span className="text-lg font-semibold min-w-[3rem] text-center text-[#175676]">
                  {numberOfPeople}
                </span>
                <button
                  onClick={() => handlePeopleChange(true)}
                  disabled={numberOfPeople >= maxPeople}
                  className="w-8 h-8 rounded-full bg-[#e6f3f8] hover:bg-[#cce6f4] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-[#175676] transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-[#64748b] text-center mt-1">
                Max: {maxPeople} people
              </p>
            </div>

            {/* Time Selection */}
            <div className="mt-6 relative" ref={timePickerRef}>
              <label className="block text-sm font-medium text-[#175676] mb-2">
                Time
              </label>
              {selectedDate ? (
                <>
                  <button
                    onClick={() => setTimePickerOpen(!timePickerOpen)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-left bg-white text-[#175676] transition-colors"
                  >
                    {selectedTime ? timeSlots.find(slot => slot.value === selectedTime)?.display : "Select a time"}
                  </button>
                  
                  {timePickerOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden">
                      <div className="max-h-60 overflow-y-auto">
                        {timeSlots.length > 0 ? (
                          timeSlots.map((slot) => (
                            <button
                              key={slot.value}
                              onClick={() => handleTimeSelect(slot.value)}
                              className={`w-full px-4 py-3 text-left hover:bg-[#e6f3f8] transition-colors text-[#175676] ${
                                selectedTime === slot.value ? 'bg-[#e6f3f8] text-[#175676]' : ''
                              }`}
                            >
                              {slot.display}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-[#64748b] text-center">
                            No available times for this date
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-[#64748b]">
                  Please select a date first
                </div>
              )}
            </div>

            {/* Book Table Button */}
            <button
              onClick={handleBookTable}
              className="w-full mt-6 bg-[#175676] text-white py-2 px-4 rounded-lg hover:bg-[#124a63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              disabled={!selectedDate || !selectedTime}
            >
              Book Table
            </button>
          </>
        ) : (
          /* Booking Form */
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[#175676] mb-2">Complete Your Booking</h2>
              <div className="bg-[#e6f3f8] p-3 rounded-lg">
                <p className="text-sm text-[#175676]">
                  <strong>Date:</strong> {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-sm text-[#175676]">
                  <strong>Time:</strong> {timeSlots.find(slot => slot.value === selectedTime)?.display}
                </p>
                <p className="text-sm text-[#175676]">
                  <strong>People:</strong> {numberOfPeople}
                </p>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#175676] mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={bookingForm.customerName}
                  onChange={(e) => {
                    setBookingForm(prev => ({ ...prev, customerName: e.target.value }));
                    setValidationErrors(prev => ({ ...prev, customerName: validateFullName(e.target.value) }));
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-[#175676]"
                  placeholder="Your full name"
                />
                {validationErrors.customerName && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#175676] mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={bookingForm.customerEmail}
                  onChange={(e) => {
                    setBookingForm(prev => ({ ...prev, customerEmail: e.target.value }));
                    setValidationErrors(prev => ({ ...prev, customerEmail: validateEmail(e.target.value) }));
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-[#175676]"
                  placeholder="your.email@example.com"
                />
                {validationErrors.customerEmail && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.customerEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#175676] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={bookingForm.customerPhone}
                  onChange={(e) => {
                    setBookingForm(prev => ({ ...prev, customerPhone: formatPhoneNumber(e.target.value) }));
                    setValidationErrors(prev => ({ ...prev, customerPhone: validatePhone(formatPhoneNumber(e.target.value)) }));
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-[#175676]"
                  placeholder="(555) 123-4567"
                />
                {validationErrors.customerPhone && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.customerPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#175676] mb-1">
                  Special Requests
                </label>
                <textarea
                  value={bookingForm.specialRequests}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175676] focus:border-transparent text-[#175676]"
                  placeholder="Any special requests or dietary restrictions?"
                  rows={3}
                />
              </div>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  ✅ Booking confirmed! You will receive a confirmation email shortly.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  ❌ There was an error creating your booking. Please try again.
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#175676] text-white py-3 px-4 rounded-lg hover:bg-[#124a63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isSubmitting ? "Creating Booking..." : "Confirm Booking"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  disabled={isSubmitting}
                  className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
} 