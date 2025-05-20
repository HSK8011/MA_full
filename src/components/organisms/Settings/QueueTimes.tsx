import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { Switch } from '../../../components/atoms/ui/switch';
import { toast } from 'react-hot-toast';
import { settingsService } from '../../../services/settingsService';

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface QueueTimesProps {
  className?: string;
  accounts: Array<{
    id: string;
    platform: string;
    username: string;
    status: string;
  }>;
}

interface TimeSlot {
  time: string;
}

interface DaySchedule {
  enabled: boolean;
  timeSlots: TimeSlot[];
}

type WeekSchedule = Record<DayOfWeek, DaySchedule>;

const QueueTimes: React.FC<QueueTimesProps> = ({ className, accounts }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string>(accounts[0]?.id || '');
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: { enabled: false, timeSlots: [] },
    tuesday: { enabled: false, timeSlots: [] },
    wednesday: { enabled: false, timeSlots: [] },
    thursday: { enabled: false, timeSlots: [] },
    friday: { enabled: false, timeSlots: [] },
    saturday: { enabled: false, timeSlots: [] },
    sunday: { enabled: false, timeSlots: [] },
  });

  useEffect(() => {
    if (selectedAccount) {
      fetchQueueSettings();
    }
  }, [selectedAccount]);

  // Update selected account when accounts change
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0].id);
    }
  }, [accounts]);

  const fetchQueueSettings = async () => {
    if (!selectedAccount) return;
    
    try {
      setIsLoading(true);
      const response = await settingsService.getQueueSettings(selectedAccount);
      
      // Transform backend data to component format
      const transformedSchedule: WeekSchedule = {
        monday: { enabled: false, timeSlots: [] },
        tuesday: { enabled: false, timeSlots: [] },
        wednesday: { enabled: false, timeSlots: [] },
        thursday: { enabled: false, timeSlots: [] },
        friday: { enabled: false, timeSlots: [] },
        saturday: { enabled: false, timeSlots: [] },
        sunday: { enabled: false, timeSlots: [] },
      };

      if (response?.queueTimes) {
        response.queueTimes.forEach(time => {
          const day = time.day.toLowerCase() as DayOfWeek;
          if (transformedSchedule[day]) {
            transformedSchedule[day].enabled = true;
            transformedSchedule[day].timeSlots.push({ time: time.startTime });
          }
        });
      }

      setSchedule(transformedSchedule);
    } catch (error) {
      console.error('Error fetching queue settings:', error);
      toast.error('Failed to load queue settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayToggle = (day: DayOfWeek) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      }
    }));
  };

  const handleAddTimeSlot = (day: DayOfWeek) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, { time: '12:00' }]
      }
    }));
  };

  const handleTimeChange = (day: DayOfWeek, index: number, newTime: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot: TimeSlot, i: number) => 
          i === index ? { ...slot, time: newTime } : slot
        )
      }
    }));
  };

  const handleRemoveTimeSlot = (day: DayOfWeek, index: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((_: TimeSlot, i: number) => i !== index)
      }
    }));
  };

  const handleSave = async () => {
    try {
      // Transform schedule to backend format
      const queueTimes = Object.entries(schedule)
        .filter(([_, { enabled }]) => enabled)
        .flatMap(([day, { timeSlots }]) =>
          timeSlots.map(slot => ({
            day: day as DayOfWeek,
            startTime: slot.time,
            endTime: slot.time // For now, end time is same as start time
          }))
        );

      await settingsService.updateQueueSettings(selectedAccount, queueTimes);
      toast.success('Queue times saved successfully');
    } catch (error) {
      console.error('Failed to save schedule:', error);
      toast.error('Failed to save queue times');
    }
  };

  if (accounts.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
        No connected social media accounts found. Please connect an account first.
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Account Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Account
        </label>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
        >
          {accounts.map(account => (
            <option key={account.id} value={account.id}>
              {account.platform} - {account.username}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Days of the Week */}
          <div className="space-y-4">
            {Object.entries(schedule).map(([day, { enabled, timeSlots }]) => (
              <div key={day} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium capitalize">{day}</h3>
                  <Switch
                    checked={enabled}
                    onCheckedChange={() => handleDayToggle(day as DayOfWeek)}
                    className="ml-4"
                  />
                </div>

                {enabled && (
                  <div className="space-y-3">
                    {timeSlots.map((slot, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="time"
                          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={slot.time}
                          onChange={(e) => handleTimeChange(day as DayOfWeek, index, e.target.value)}
                        />
                        <button
                          onClick={() => handleRemoveTimeSlot(day as DayOfWeek, index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddTimeSlot(day as DayOfWeek)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Time Slot
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleSave}
            >
              Save Queue Times
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QueueTimes; 