import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface QueueTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (queueTime: QueueTimeFormData) => void;
  initialData?: QueueTimeFormData;
  isEditing?: boolean;
}

export interface QueueTimeFormData {
  id?: string;
  day: string;
  time: string;
  platform?: string;
  account?: string;
}

export const QueueTimeModal: React.FC<QueueTimeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<QueueTimeFormData>(
    initialData || {
      day: '',
      time: '',
      platform: 'all',
      account: 'all'
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const days = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? 'AM' : 'PM';
    return `${hour}:00 ${period}`;
  });

  const platforms = [
    { id: 'all', name: 'All Platforms' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'linkedin', name: 'LinkedIn' }
  ];

  const accounts = [
    { id: 'all', name: 'All Accounts' },
    { id: 'acc_1', name: 'AIMDek Technologies' },
    { id: 'acc_2', name: 'AIMDek Tech' },
    { id: 'acc_3', name: 'AIMDek Official' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Edit Queue Time' : 'Add Queue Time'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Platform
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {platforms.map(platform => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Account
              </label>
              <select
                name="account"
                value={formData.account}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Day
              </label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a day</option>
                {days.map(day => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a time</option>
                {times.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditing ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QueueTimeModal; 