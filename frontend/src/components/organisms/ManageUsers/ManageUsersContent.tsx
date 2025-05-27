import React, { useState } from 'react';
import { cn } from '../../../lib/utils';

interface ManageUsersContentProps {
  className?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions: Array<'create_posts' | 'connect_accounts' | 'view_analytics'>;
}

export const ManageUsersContent: React.FC<ManageUsersContentProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      firstName: 'AIMDek',
      lastName: 'Technologies',
      email: 'info@aimdek.com',
      role: 'Admin',
      permissions: ['create_posts', 'connect_accounts']
    },
    {
      id: '2',
      firstName: 'AIMDek',
      lastName: 'Marketing',
      email: 'marketing@aimdek.com',
      role: 'Editor',
      permissions: ['create_posts', 'connect_accounts']
    },
    {
      id: '3',
      firstName: 'Tudu',
      lastName: 'Marketing',
      email: 'mkt@tudu.com',
      role: 'Viewer',
      permissions: ['create_posts', 'connect_accounts']
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userForm, setUserForm] = useState<{
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    permissions: Array<'create_posts' | 'connect_accounts' | 'view_analytics'>;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Select Role',
    permissions: []
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle edit user function 
  const handleEditUser = (userId: string) => {
    const userToEdit = users.find(user => user.id === userId);
    if (userToEdit) {
      setUserForm({
        id: userToEdit.id,
        firstName: userToEdit.firstName,
        lastName: userToEdit.lastName,
        email: userToEdit.email,
        role: userToEdit.role,
        permissions: [...userToEdit.permissions]
      });
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  // Handle delete user function
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // Toggle modal
  const openAddUserModal = () => {
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      role: 'Select Role',
      permissions: []
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle input change for form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox change for permissions
  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const permissionValue = value as 'create_posts' | 'connect_accounts' | 'view_analytics';
    
    setUserForm(prev => {
      if (checked) {
        return {
          ...prev,
          permissions: [...prev.permissions, permissionValue]
        };
      } else {
        return {
          ...prev,
          permissions: prev.permissions.filter(p => p !== permissionValue)
        };
      }
    });
  };

  // Handle form submission
  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!userForm.firstName.trim() || !userForm.lastName.trim() || !userForm.email.trim() || userForm.role === 'Select Role') {
      alert('Please fill in all required fields.');
      return;
    }
    
    if (isEditing && userForm.id) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === userForm.id 
          ? { ...userForm as User } 
          : user
      ));
    } else {
      // Add new user
      const newId = (parseInt(users[users.length - 1]?.id || '0') + 1).toString();
      const userToAdd: User = {
        id: newId,
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        email: userForm.email,
        role: userForm.role,
        permissions: userForm.permissions
      };
      
      setUsers([...users, userToAdd]);
    }
    
    closeModal();
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-sm", className)}>
      <div className="p-6">
        <h1 className="text-2xl font-medium text-gray-800 mb-6">Manage Users</h1>
        
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg 
                className="w-4 h-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search User"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-80"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            onClick={openAddUserModal}
          >
            Add New User
          </button>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  USER NAME
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  EMAIL ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  PERMISSION
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-800">{user.firstName} {user.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {user.permissions.includes('create_posts') && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Create Posts
                        </span>
                      )}
                      {user.permissions.includes('connect_accounts') && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Connect Accounts
                        </span>
                      )}
                      {user.permissions.includes('view_analytics') && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          View Analytics
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                      className="text-blue-600 hover:text-blue-900 mr-4"
                        onClick={() => handleEditUser(user.id)}
                    >
                      Edit
                      </button>
                      <button
                      className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                      </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
      
        {/* Add/Edit User Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-900">
              {isEditing ? 'Edit User' : 'Add New User'}
            </h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmitUser}>
                <div className="mb-4">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={userForm.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={userForm.lastName}
                    onChange={handleInputChange}
                    required
                  />
              </div>
              
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={userForm.email}
                  onChange={handleInputChange}
                    required
                />
              </div>
              
                <div className="mb-4">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  id="role"
                  name="role"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={userForm.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Select Role" disabled>Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                        id="create_posts"
                      name="permissions"
                      value="create_posts"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={userForm.permissions.includes('create_posts')}
                      onChange={handlePermissionChange}
                    />
                      <label htmlFor="create_posts" className="ml-2 text-sm text-gray-700">Create Posts</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                        id="connect_accounts"
                      name="permissions"
                      value="connect_accounts"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={userForm.permissions.includes('connect_accounts')}
                      onChange={handlePermissionChange}
                    />
                      <label htmlFor="connect_accounts" className="ml-2 text-sm text-gray-700">Connect Accounts</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                        id="view_analytics"
                      name="permissions"
                      value="view_analytics"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={userForm.permissions.includes('view_analytics')}
                      onChange={handlePermissionChange}
                    />
                      <label htmlFor="view_analytics" className="ml-2 text-sm text-gray-700">View Analytics</label>
                  </div>
                </div>
              </div>
              
                <div className="flex justify-end space-x-3">
                <button
                  type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {isEditing ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ManageUsersContent; 