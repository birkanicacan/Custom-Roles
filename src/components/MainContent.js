import React from 'react';
import { UserGroupIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate, Routes, Route } from 'react-router-dom';
import UserRolesPage from './UserRolesPage';
import MembersPage from './MembersPage';

function SettingsPage({ settings, toggles, roles }) {
  const navigate = useNavigate();
  
  // Update stats with actual role counts
  const updatedSettings = settings.map(setting => {
    if (setting.title === 'Manage user roles') {
      const systemRolesCount = roles.filter(role => role.isSystemRole).length;
      const customRolesCount = roles.filter(role => !role.isSystemRole).length;
      return {
        ...setting,
        stats: `${systemRolesCount} system roles · ${customRolesCount} custom roles`
      };
    }
    return setting;
  });

  return (
    <div className="flex-1 bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-6">
        <div className="mb-8">
          <h1 className="text-[22px] font-medium text-gray-900 mb-2">People</h1>
          <p className="text-gray-600 text-sm">
            Manage access, permissions, and user accounts. Oversee members, guests, and groups seamlessly.
          </p>
          <button className="mt-4 px-4 py-2 bg-[#2381fe] text-white rounded-md hover:bg-blue-600 text-sm font-medium">
            Add members
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-base font-medium text-gray-900 mb-4">Roles & permissions</h2>
          <div className="space-y-2">
            {updatedSettings.map((setting) => (
              <div
                key={setting.title}
                onClick={() => setting.path && navigate(setting.path)}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer"
              >
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{setting.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{setting.description}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  {setting.stats}
                  <InformationCircleIcon className="w-5 h-5 ml-2 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-base font-medium text-gray-900 mb-4">Managed accounts</h2>
          <div className="space-y-2">
            {toggles.map((toggle) => (
              <div
                key={toggle.title}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
              >
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{toggle.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{toggle.description}</p>
                </div>
                <button
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    toggle.enabled ? 'bg-[#2381fe]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      toggle.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold mb-4">Account access</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Session duration</h3>
                <p className="text-sm text-gray-600">Set re-authentication interval for managed accounts.</p>
              </div>
              <span className="text-sm text-gray-500">180 days</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Reset passwords for all users</h3>
                <p className="text-sm text-gray-600">Log out and force all managed users to reset their passwords on next login.</p>
              </div>
              <button className="text-red-600 hover:text-red-700 font-medium">
                Reset all passwords
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Log out all users</h3>
                <p className="text-sm text-gray-600">Log out all managed users and require re-authentication.</p>
              </div>
              <button className="text-red-600 hover:text-red-700 font-medium">
                Log out all users
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainContent({ roles, onRolesChange }) {
  const settings = [
    {
      title: 'Manage members',
      description: 'Add, remove, or adjust member roles',
      stats: `${roles.reduce((total, role) => total + (role.assignedMembers?.length || 0), 0)} total members`,
      path: '/members'
    },
    {
      title: 'Manage guests',
      description: 'Invite for page access or upgrade to members for full workspace access.',
      stats: '5 guests',
      path: '/guests'
    },
    {
      title: 'Manage groups',
      description: 'Add and remove members from permission groups.',
      stats: '0 permission groups',
      path: '/groups'
    },
    {
      title: 'Manage user accounts',
      description: 'Manage user accounts with verified domain emails.',
      stats: '564 accounts',
      path: '/accounts'
    },
    {
      title: 'Manage user roles',
      description: 'Create new or manage existing user roles',
      stats: `${roles.length} roles`,
      path: '/user-roles'
    },
  ];

  const toggles = [
    {
      title: 'Allow users to change profile information',
      description: 'Allow managed users to update their name, email, and profile photo.',
      enabled: true,
    },
    {
      title: 'Allow users to create new workspaces',
      description: 'When on, any user can create workspaces. When off, only organization owners can.',
      enabled: false,
    },
    {
      title: 'Allow users to join external workspaces',
      description: 'When on, all members can join external workspaces. When off, only organization owners can.',
      enabled: true,
    },
    {
      title: 'Allow users to grant support access to accounts',
      description: 'Allow Notion Support to troubleshoot or recover content; access can be revoked anytime',
      enabled: true,
    },
  ];

  return (
    <Routes>
      <Route path="/people" element={<SettingsPage settings={settings} toggles={toggles} roles={roles} />} />
      <Route path="/members" element={<MembersPage roles={roles} />} />
      <Route path="/user-roles" element={
        <UserRolesPage 
          roles={roles} 
          onRolesChange={onRolesChange} 
        />
      } />
    </Routes>
  );
}

export default MainContent; 