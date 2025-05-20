import React, { useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { Checkbox } from '../../../components/atoms/ui/checkbox';
import { toast } from 'react-hot-toast';
import { settingsService } from '../../../services/settingsService';
import type { NotificationPreference } from '../../../types/settings';

interface NotificationSettingsProps {
  className?: string;
}

interface NotificationType {
  id: string;
  title: string;
  description: string;
  emailEnabled: boolean;
  desktopEnabled: boolean;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className }) => {
  const [notifications, setNotifications] = React.useState<NotificationType[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await settingsService.getSettings();
      const notificationPrefs = response.notificationPreferences;
      
      // Transform backend data to component format
      const transformedNotifications = notificationPrefs.map(pref => ({
        id: pref._id,
        title: pref.type,
        description: `Notification for ${pref.type}`,
        emailEnabled: pref.enabled && pref.frequency !== 'never',
        desktopEnabled: pref.enabled
      }));

      setNotifications(transformedNotifications);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notification settings');
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string, type: 'email' | 'desktop') => {
    try {
      const notification = notifications.find(n => n.id === id);
      if (!notification) return;

      const updatedNotifications = notifications.map(n => {
        if (n.id === id) {
          return {
            ...n,
            [type === 'email' ? 'emailEnabled' : 'desktopEnabled']: 
              !n[type === 'email' ? 'emailEnabled' : 'desktopEnabled']
          };
        }
        return n;
      });

      setNotifications(updatedNotifications);

      // Transform to backend format
      const preferencesToUpdate = updatedNotifications.map(n => ({
        _id: n.id,
        type: n.title,
        enabled: n.emailEnabled || n.desktopEnabled,
        frequency: n.emailEnabled ? 'daily' : 'never'
      }));

      await settingsService.updateNotifications(preferencesToUpdate);
      toast.success('Notification settings updated');
    } catch (error) {
      console.error('Error updating notification:', error);
      toast.error('Failed to update notification settings');
      // Revert changes on error
      await fetchNotifications();
    }
  };

  if (isLoading) {
    return <div>Loading notification settings...</div>;
    }

  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-sm text-gray-500">
        You will get only notification what have enabled.
      </p>

      <div className="mt-6 overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notification Type
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Notification
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Desktop Notification
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {notifications.map((notification) => (
              <tr key={notification.id}>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">
                      {notification.title}
        </div>
                    <div className="text-sm text-gray-500">
                      {notification.description}
        </div>
                </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <Checkbox
                    checked={notification.emailEnabled}
                    onCheckedChange={() => handleToggle(notification.id, 'email')}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <Checkbox
                    checked={notification.desktopEnabled}
                    onCheckedChange={() => handleToggle(notification.id, 'desktop')}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationSettings; 