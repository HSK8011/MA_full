import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { Switch } from '../../../components/atoms/ui/switch';
import { Button } from '../../../components/atoms/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/atoms/ui/dialog';
import { Input } from '../../../components/atoms/ui/input';
import { Label } from '../../../components/atoms/ui/label';
import type { SecurityData } from '../../../types/settings';
import { toast } from 'react-hot-toast';

interface SecuritySettingsProps {
  className?: string;
  securityData?: SecurityData;
  onUpdate: (data: SecurityData) => Promise<void>;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  className,
  securityData = { // Provide default values
    isTwoFactorEnabled: false,
    isActivityLoggingEnabled: false,
    lastPasswordChange: undefined
  },
  onUpdate
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleActivityLogsToggle = async (enabled: boolean) => {
    if (!securityData) return;
    
    try {
      setIsLoading(true);
      await onUpdate({
        ...securityData,
        isActivityLoggingEnabled: enabled
      });
      toast.success(`Activity logs ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update activity logs settings');
      console.error('Error updating activity logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    if (!securityData) return;

    try {
      setIsLoading(true);
      const newState = !securityData.isTwoFactorEnabled;
      await onUpdate({
        ...securityData,
        isTwoFactorEnabled: newState
      });
      toast.success(`Two-factor authentication ${newState ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update two-factor authentication');
      console.error('Error updating 2FA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityData) return;
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsLoading(true);
      await onUpdate({
        ...securityData,
        lastPasswordChange: new Date().toISOString(),
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <p className="text-sm text-gray-500">
        These settings will help you to keep your account secure.
      </p>

      {/* Activity Logs Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-900">Save my activity logs</h3>
            <p className="text-sm text-gray-500">
              You can save your all activity logs including unusual activity detected.
            </p>
      </div>
          <Switch
            checked={securityData?.isActivityLoggingEnabled || false}
            onCheckedChange={handleActivityLogsToggle}
            disabled={isLoading}
            className="ml-4"
          />
        </div>
        </div>
        
      {/* Password Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
            <p className="text-sm text-gray-500">
              Set a unique password to protect your account.
            </p>
            </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Last changed: {securityData?.lastPasswordChange ? new Date(securityData.lastPasswordChange).toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Never'}
            </span>
            <Button 
              variant="default" 
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setShowPasswordModal(true)}
              disabled={isLoading}
            >
              Change Password
            </Button>
          </div>
          </div>
        </div>
        
      {/* 2FA Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium text-gray-900">2 Factor Auth</h3>
              <span className={cn(
                "text-sm px-2 py-0.5 rounded",
                securityData?.isTwoFactorEnabled 
                  ? "text-green-600 bg-green-50" 
                  : "text-gray-600 bg-gray-50"
              )}>
                {securityData?.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Secure your account with 2FA security. When it is activated you will need to enter not only your
              password, but also a special code using app. You will receive this code via mobile application.
            </p>
          </div>
          <Button 
            variant="default" 
            className={cn(
              "ml-4",
              securityData?.isTwoFactorEnabled 
                ? "bg-red-600 text-white hover:bg-red-700" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
            onClick={handleTwoFactorToggle}
            disabled={isLoading}
          >
            {securityData?.isTwoFactorEnabled ? 'Disable' : 'Enable'}
          </Button>
          </div>
        </div>
        
      {/* Password Change Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 border border-gray-200">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Change Password
            </DialogTitle>
            <p className="text-sm text-gray-500">
              Please enter your current password and choose a new password.
            </p>
          </DialogHeader>
          
          <form onSubmit={handlePasswordChange} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                    Current Password
              </Label>
              <Input
                id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                    New Password
              </Label>
              <Input
                id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                minLength={8}
                  />
              <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
                </div>
                
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
              </div>
              
            <DialogFooter className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
              <Button
                  type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
              </Button>
              <Button
                  type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecuritySettings; 