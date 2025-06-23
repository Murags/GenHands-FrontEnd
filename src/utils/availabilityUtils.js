// Availability type constants
export const AVAILABILITY_TYPES = {
  RECURRING_WEEKLY: 'recurring_weekly',
  SPECIFIC_DATES: 'specific_dates',
  DATE_RANGE: 'date_range',
  ALWAYS_AVAILABLE: 'always_available',
};

// Day of week constants
export const DAYS_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

// Day names for display
export const DAY_NAMES = {
  [DAYS_OF_WEEK.SUNDAY]: 'Sunday',
  [DAYS_OF_WEEK.MONDAY]: 'Monday',
  [DAYS_OF_WEEK.TUESDAY]: 'Tuesday',
  [DAYS_OF_WEEK.WEDNESDAY]: 'Wednesday',
  [DAYS_OF_WEEK.THURSDAY]: 'Thursday',
  [DAYS_OF_WEEK.FRIDAY]: 'Friday',
  [DAYS_OF_WEEK.SATURDAY]: 'Saturday',
};

// Transportation mode constants
export const TRANSPORTATION_MODES = {
  CAR: 'car',
  BICYCLE: 'bicycle',
  MOTORCYCLE: 'motorcycle',
  PUBLIC_TRANSPORT: 'public_transport',
  WALKING: 'walking',
  OTHER: 'other',
};

// Transportation mode display names
export const TRANSPORTATION_MODE_NAMES = {
  [TRANSPORTATION_MODES.CAR]: 'Car',
  [TRANSPORTATION_MODES.BICYCLE]: 'Bicycle',
  [TRANSPORTATION_MODES.MOTORCYCLE]: 'Motorcycle',
  [TRANSPORTATION_MODES.PUBLIC_TRANSPORT]: 'Public Transport',
  [TRANSPORTATION_MODES.WALKING]: 'Walking',
  [TRANSPORTATION_MODES.OTHER]: 'Other',
};

// Validation functions
export const isValidTimeFormat = (time) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
};

export const isValidDateFormat = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date) && !isNaN(Date.parse(date));
};

export const isValidCoordinates = (coordinates) => {
  return Array.isArray(coordinates) &&
         coordinates.length === 2 &&
         typeof coordinates[0] === 'number' &&
         typeof coordinates[1] === 'number' &&
         coordinates[0] >= -180 && coordinates[0] <= 180 && // longitude
         coordinates[1] >= -90 && coordinates[1] <= 90; // latitude
};

export const isValidRadius = (radius) => {
  return typeof radius === 'number' && radius >= 1 && radius <= 100;
};

export const isValidDayOfWeek = (day) => {
  return typeof day === 'number' && day >= 0 && day <= 6;
};

// Validation for different availability types
export const validateAvailabilityData = (data) => {
  const errors = [];

  // Check required type
  if (!data.type || !Object.values(AVAILABILITY_TYPES).includes(data.type)) {
    errors.push('Invalid or missing availability type');
  }

  // Validate service area if provided
  if (data.serviceArea) {
    if (data.serviceArea.center?.coordinates) {
      if (!isValidCoordinates(data.serviceArea.center.coordinates)) {
        errors.push('Invalid service area coordinates');
      }
    }
    if (data.serviceArea.maxRadius && !isValidRadius(data.serviceArea.maxRadius)) {
      errors.push('Invalid service area radius (must be between 1-100 km)');
    }
  }

  // Validate transportation mode if provided
  if (data.preferences?.transportationMode &&
      !Object.values(TRANSPORTATION_MODES).includes(data.preferences.transportationMode)) {
    errors.push('Invalid transportation mode');
  }

  // Type-specific validations
  switch (data.type) {
    case AVAILABILITY_TYPES.RECURRING_WEEKLY:
      if (!data.recurringSchedule || !Array.isArray(data.recurringSchedule)) {
        errors.push('Recurring schedule is required for recurring_weekly type');
      } else {
        data.recurringSchedule.forEach((schedule, index) => {
          if (!isValidDayOfWeek(schedule.dayOfWeek)) {
            errors.push(`Invalid day of week at index ${index}`);
          }
          if (!schedule.timeSlots || !Array.isArray(schedule.timeSlots)) {
            errors.push(`Time slots are required for schedule at index ${index}`);
          } else {
            schedule.timeSlots.forEach((slot, slotIndex) => {
              if (!isValidTimeFormat(slot.startTime) || !isValidTimeFormat(slot.endTime)) {
                errors.push(`Invalid time format in schedule ${index}, slot ${slotIndex}`);
              }
            });
          }
        });
      }
      break;

    case AVAILABILITY_TYPES.SPECIFIC_DATES:
      if (!data.specificDates || !Array.isArray(data.specificDates)) {
        errors.push('Specific dates are required for specific_dates type');
      } else {
        data.specificDates.forEach((dateEntry, index) => {
          if (!isValidDateFormat(dateEntry.date)) {
            errors.push(`Invalid date format at index ${index}`);
          }
          if (!dateEntry.timeSlots || !Array.isArray(dateEntry.timeSlots)) {
            errors.push(`Time slots are required for date at index ${index}`);
          } else {
            dateEntry.timeSlots.forEach((slot, slotIndex) => {
              if (!isValidTimeFormat(slot.startTime) || !isValidTimeFormat(slot.endTime)) {
                errors.push(`Invalid time format in date ${index}, slot ${slotIndex}`);
              }
            });
          }
        });
      }
      break;

    case AVAILABILITY_TYPES.DATE_RANGE:
      if (!data.dateRange) {
        errors.push('Date range is required for date_range type');
      } else {
        if (!isValidDateFormat(data.dateRange.startDate) || !isValidDateFormat(data.dateRange.endDate)) {
          errors.push('Invalid start or end date format in date range');
        }
        if (data.dateRange.daysOfWeek) {
          if (!Array.isArray(data.dateRange.daysOfWeek)) {
            errors.push('Days of week must be an array');
          } else {
            data.dateRange.daysOfWeek.forEach((day, index) => {
              if (!isValidDayOfWeek(day)) {
                errors.push(`Invalid day of week at index ${index} in date range`);
              }
            });
          }
        }
        if (data.dateRange.timeSlots) {
          data.dateRange.timeSlots.forEach((slot, index) => {
            if (!isValidTimeFormat(slot.startTime) || !isValidTimeFormat(slot.endTime)) {
              errors.push(`Invalid time format in date range slot ${index}`);
            }
          });
        }
      }
      break;

    case AVAILABILITY_TYPES.ALWAYS_AVAILABLE:
      // Optional validations for always available
      if (data.generalTimeSlots) {
        data.generalTimeSlots.forEach((slot, index) => {
          if (!isValidTimeFormat(slot.startTime) || !isValidTimeFormat(slot.endTime)) {
            errors.push(`Invalid time format in general time slot ${index}`);
          }
        });
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format time for display (12-hour format)
export const formatTimeForDisplay = (time24) => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

// Format date for display
export const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get day name from day number
export const getDayName = (dayNumber) => {
  return DAY_NAMES[dayNumber] || 'Unknown';
};

// Create example availability data
export const createExampleAvailabilityData = (type) => {
  const baseData = {
    serviceArea: {
      center: {
        coordinates: [36.8219, -1.2921] // Nairobi coordinates
      },
      maxRadius: 15
    },
    preferences: {
      maxPickupsPerDay: 2,
      transportationMode: TRANSPORTATION_MODES.CAR
    }
  };

  switch (type) {
    case AVAILABILITY_TYPES.RECURRING_WEEKLY:
      return {
        type: AVAILABILITY_TYPES.RECURRING_WEEKLY,
        recurringSchedule: [
          {
            dayOfWeek: DAYS_OF_WEEK.MONDAY,
            timeSlots: [{ startTime: "09:00", endTime: "17:00" }]
          }
        ],
        ...baseData
      };

    case AVAILABILITY_TYPES.SPECIFIC_DATES:
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return {
        type: AVAILABILITY_TYPES.SPECIFIC_DATES,
        specificDates: [
          {
            date: tomorrow.toISOString().split('T')[0],
            timeSlots: [{ startTime: "10:00", endTime: "14:00" }]
          }
        ],
        ...baseData
      };

    case AVAILABILITY_TYPES.DATE_RANGE:
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 7);
      return {
        type: AVAILABILITY_TYPES.DATE_RANGE,
        dateRange: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          daysOfWeek: [1, 2, 3, 4, 5], // Weekdays
          timeSlots: [{ startTime: "17:00", endTime: "20:00" }]
        },
        ...baseData
      };

    case AVAILABILITY_TYPES.ALWAYS_AVAILABLE:
      return {
        type: AVAILABILITY_TYPES.ALWAYS_AVAILABLE,
        generalTimeSlots: [{ startTime: "08:00", endTime: "22:00" }],
        ...baseData
      };

    default:
      return null;
  }
};
