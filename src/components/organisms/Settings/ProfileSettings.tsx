import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { cn } from '../../../lib/utils';
import { Input } from '../../../components/atoms/ui/input';
import { Label } from '../../../components/atoms/ui/label';
import { Button } from '../../../components/atoms/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/atoms/ui/select';
import { toast } from 'react-hot-toast';
import type { User, ProfileData } from '../../../types/settings';

interface ProfileSettingsProps {
  className?: string;
  profileData?: User;
  onUpdate: (data: ProfileData) => Promise<void>;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  className,
  profileData: initialProfileData,
  onUpdate 
}) => {
  const [formData, setFormData] = useState<ProfileData>({
    name: initialProfileData?.name ?? '',
    phone: initialProfileData?.phone ?? undefined,
    timezone: initialProfileData?.timezone ?? 'Culcutta (+05:30)'
  });

  const handleSaveChanges = async () => {
    try {
      await onUpdate(formData);
      toast.success('Profile settings saved successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile settings');
    }
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic
    console.log('Delete account clicked');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: keyof ProfileData) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <p className="text-sm text-gray-500 mt-1">
          Basic info, like your name and address, that you use on Nio Platform.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Image Section */}
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-semibold text-blue-600">
                {formData.name.split(' ').map(word => word[0]).join('').toUpperCase()}
              </span>
            </div>
            <button 
              className="absolute -top-1 -right-1 p-1 bg-white rounded-full border border-gray-200 shadow-sm"
              aria-label="Edit profile picture"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange(e, 'name')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone No.</Label>
            <Input
              id="phone"
              value={formData.phone ?? ''}
              onChange={(e) => handleInputChange(e, 'phone')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={initialProfileData?.email ?? ''}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select 
              value={formData.timezone}
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, timezone: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Culcutta (+05:30)">Culcutta (+05:30)</SelectItem>
                <SelectItem value="Mumbai (+05:30)">Mumbai (+05:30)</SelectItem>
                <SelectItem value="Delhi (+05:30)">Delhi (+05:30)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={handleDeleteAccount}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Delete My Account
        </Button>
        
        <Button
          onClick={handleSaveChanges}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings; 