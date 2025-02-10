import React, { useState } from 'react';
import { XMarkIcon, ClipboardIcon, Cog6ToothIcon, BuildingOfficeIcon, UserGroupIcon, ClipboardDocumentListIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

function UserDetailDialog({ user, onClose, roles }) {
  const joinedDate = 'Feb 6, 2025';
  const [activeTab, setActiveTab] = useState('general');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Get system roles from the roles prop
  const systemRoles = roles
    ?.filter(role => role.isSystemRole)
    .map(role => ({
      name: role.name,
      type: 'System role',
      current: user.role === role.name
    })) || [];

  // Get custom roles from the roles prop
  const customRoles = roles
    ?.filter(role => !role.isSystemRole)
    .map(role => ({
      name: role.name,
      type: 'Custom role',
      current: user.role === role.name
    })) || [];

  const renderContent = () => {
    if (activeTab === 'general') {
      return (
        <>
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Email</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900">{user.email}</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <ClipboardIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Support access</span>
                <span className="text-gray-900">Unsupported</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Last active</span>
                <span className="text-gray-900">{user.lastActive}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Joined</span>
                <span className="text-gray-900">{joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Managed User Access */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">Managed user access</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="text-gray-400 mt-0.5">
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 2.495c.873-1.562 3.157-1.562 4.03 0l6.28 11.25c.873 1.562-.217 3.505-2.015 3.505H4.22c-1.798 0-2.888-1.943-2.015-3.505l6.28-11.25zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-700 font-medium">Managed actions are not available for this user</div>
                  <div className="text-gray-500 text-sm">These settings are only available for user accounts with verified domains.</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Allow support access</h4>
                  <p className="text-sm text-gray-500">Enable Notion support to troubleshoot or recover content.</p>
                </div>
                <span className="text-sm text-gray-500">Not granted</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Suspend or re-activate user</h4>
                  <p className="text-sm text-gray-500">Suspend to restrict all workspace access while keeping content and integrations active. Reactivate to restore access.</p>
                </div>
                <button className="text-sm text-gray-700 hover:text-gray-900 font-medium">
                  Suspend user
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Reset password</h4>
                  <p className="text-sm text-gray-500">Log out user and require password reset on next login.</p>
                </div>
                <button className="text-sm text-gray-700 hover:text-gray-900 font-medium">
                  Reset password
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Force log out</h4>
                  <p className="text-sm text-gray-500">Log out user from all active sessions.</p>
                </div>
                <button className="text-sm text-gray-700 hover:text-gray-900 font-medium">
                  Force log out
                </button>
              </div>
            </div>
          </div>
        </>
      );
    } else if (activeTab === 'workspaces') {
      return (
        <>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Workspaces</h2>
          <p className="text-sm text-gray-600 mb-6">
            Add, remove, or adjust this user's role to control their workspace access and collaboration permissions.
          </p>

          <div className="mt-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="text-sm font-medium">Notion Lumi Labs B</div>
                  <div className="text-xs text-gray-500">Workspace · 1 teamspace</div>
                </div>
              </div>
              <div className="relative">
                <button 
                  className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                >
                  {user.role || 'Select role'}
                  <ChevronDownIcon className="w-4 h-4 ml-2" />
                </button>
                {showRoleDropdown && (
                  <div className="absolute right-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      {/* System Roles */}
                      {roles.filter(role => role.isSystemRole).map((role) => (
                        <button 
                          key={role.name}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between group"
                        >
                          <div>
                            <span>{role.name}</span>
                            <span className="ml-2 text-xs text-gray-400">System</span>
                          </div>
                          {user.role === role.name && <span className="text-gray-400">✓</span>}
                        </button>
                      ))}

                      {/* Divider before Custom Roles */}
                      {roles.some(role => !role.isSystemRole) && (
                        <div className="border-t border-gray-200 my-1" />
                      )}

                      {/* Custom Roles */}
                      {roles.filter(role => !role.isSystemRole).map((role) => (
                        <button 
                          key={role.name}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between group"
                        >
                          <div>
                            <span>{role.name}</span>
                            <span className="ml-2 text-xs text-gray-400">Custom</span>
                          </div>
                          {user.role === role.name && <span className="text-gray-400">✓</span>}
                        </button>
                      ))}

                      {/* Divider before Remove option */}
                      <div className="border-t border-gray-200 my-1" />
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                        Remove from workspace
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl min-h-[600px] max-h-[85vh] flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 min-h-[600px]">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#2381fe] rounded-md flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </div>
          </div>

          <nav className="mt-2">
            <button 
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center px-4 py-2 text-sm ${
                activeTab === 'general' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Cog6ToothIcon className="w-5 h-5 mr-3 text-gray-400" />
              General
            </button>
            <button 
              onClick={() => setActiveTab('workspaces')}
              className={`w-full flex items-center px-4 py-2 text-sm ${
                activeTab === 'workspaces' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BuildingOfficeIcon className="w-5 h-5 mr-3 text-gray-400" />
              Workspaces
            </button>
            <button 
              onClick={() => setActiveTab('groups')}
              className={`w-full flex items-center px-4 py-2 text-sm ${
                activeTab === 'groups' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <UserGroupIcon className="w-5 h-5 mr-3 text-gray-400" />
              Groups
            </button>
            <button 
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center px-4 py-2 text-sm ${
                activeTab === 'audit' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ClipboardDocumentListIcon className="w-5 h-5 mr-3 text-gray-400" />
              Audit log
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-[600px]">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#2381fe] rounded-lg flex items-center justify-center text-white font-semibold text-xl">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <div className="text-sm text-[#2381fe]">{user.role}</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-sm text-gray-500 hover:text-gray-700">
                Edit details
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8 overflow-y-auto flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailDialog; 