import React, { useState } from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import UserDetailDialog from './UserDetailDialog';

function MembersPage({ roles }) {
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [selectedUser, setSelectedUser] = useState(null);
  const [members] = useState([
    {
      id: 1,
      name: 'Birkan Icacan',
      role: 'Organization owner',
      email: 'birkan.icacan@lumilabs.com',
      workspaces: 'All organizational workspaces',
      lastActive: 'Feb 7, 2025'
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Organization owner',
      email: 'jane.smith@lumilabs.com',
      workspaces: 'All organizational workspaces',
      lastActive: 'Feb 6, 2025'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Workspace Owner',
      email: 'mike.johnson@lumilabs.com',
      workspaces: 'Marketing, Sales, Engineering',
      lastActive: 'Feb 6, 2025'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      role: 'Workspace Owner',
      email: 'sarah.wilson@lumilabs.com',
      workspaces: 'Design, Product',
      lastActive: 'Feb 5, 2025'
    },
    {
      id: 5,
      name: 'Alex Brown',
      role: 'Membership Admin',
      email: 'alex.brown@lumilabs.com',
      workspaces: 'All organizational workspaces',
      lastActive: 'Feb 4, 2025'
    },
    {
      id: 6,
      name: 'Emily Davis',
      role: 'Membership Admin',
      email: 'emily.davis@lumilabs.com',
      workspaces: 'All organizational workspaces',
      lastActive: 'Feb 3, 2025'
    },
    {
      id: 7,
      name: 'David Lee',
      role: 'Member',
      email: 'david.lee@lumilabs.com',
      workspaces: 'Marketing',
      lastActive: 'Feb 2, 2025'
    },
    {
      id: 8,
      name: 'Lisa Wang',
      role: 'Member',
      email: 'lisa.wang@lumilabs.com',
      workspaces: 'Engineering',
      lastActive: 'Feb 1, 2025'
    },
    {
      id: 9,
      name: 'Chris Taylor',
      role: 'Knowledge Base Manager',
      email: 'chris.taylor@lumilabs.com',
      workspaces: 'Product, Design',
      lastActive: 'Jan 31, 2025'
    },
    {
      id: 10,
      name: 'Rachel Kim',
      role: 'Knowledge Base Manager',
      email: 'rachel.kim@lumilabs.com',
      workspaces: 'Marketing, Sales',
      lastActive: 'Jan 30, 2025'
    },
    {
      id: 11,
      name: 'James Wilson',
      role: 'Member',
      email: 'james.wilson@lumilabs.com',
      workspaces: 'Sales',
      lastActive: 'Jan 31, 2025'
    },
    {
      id: 12,
      name: 'Emma Brown',
      role: 'Member',
      email: 'emma.brown@lumilabs.com',
      workspaces: 'Marketing, Design',
      lastActive: 'Jan 30, 2025'
    },
    {
      id: 13,
      name: 'Michael Chen',
      role: 'Member',
      email: 'michael.chen@lumilabs.com',
      workspaces: 'Engineering, Product',
      lastActive: 'Jan 29, 2025'
    },
    {
      id: 14,
      name: 'Sophia Garcia',
      role: 'Member',
      email: 'sophia.garcia@lumilabs.com',
      workspaces: 'Sales, Marketing',
      lastActive: 'Jan 28, 2025'
    },
    {
      id: 15,
      name: 'Daniel Kim',
      role: 'Member',
      email: 'daniel.kim@lumilabs.com',
      workspaces: 'Design',
      lastActive: 'Jan 27, 2025'
    },
    {
      id: 16,
      name: 'Olivia Martinez',
      role: 'Member',
      email: 'olivia.martinez@lumilabs.com',
      workspaces: 'Product',
      lastActive: 'Jan 26, 2025'
    },
    {
      id: 17,
      name: 'William Taylor',
      role: 'Member',
      email: 'william.taylor@lumilabs.com',
      workspaces: 'Engineering',
      lastActive: 'Jan 25, 2025'
    },
    {
      id: 18,
      name: 'Isabella Anderson',
      role: 'Member',
      email: 'isabella.anderson@lumilabs.com',
      workspaces: 'Marketing',
      lastActive: 'Jan 24, 2025'
    }
  ]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex-1 bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-6">
        <div className="mb-8">
          <h1 className="text-[22px] font-medium text-gray-900 mb-2">Manage members</h1>
          <p className="text-gray-600 text-sm">
            Add, remove, or change member roles to manage access and collaboration across workspaces.
          </p>
          <button className="mt-4 px-4 py-2 bg-[#2381fe] text-white rounded-md hover:bg-blue-600 text-sm font-medium">
            Add members
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Filters */}
                <div className="relative">
                  <button className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                    Role
                    <ChevronDownIcon className="w-4 h-4 ml-2" />
                  </button>
                </div>
                <div className="relative">
                  <button className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                    Email
                    <ChevronDownIcon className="w-4 h-4 ml-2" />
                  </button>
                </div>
                <div className="relative">
                  <button className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                    Workspace
                    <ChevronDownIcon className="w-4 h-4 ml-2" />
                  </button>
                </div>
                <div className="relative">
                  <button className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                    Status
                    <ChevronDownIcon className="w-4 h-4 ml-2" />
                  </button>
                </div>
                <div className="relative">
                  <button className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                    Last active
                    <ChevronDownIcon className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search"
                />
              </div>
            </div>
          </div>

          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={members.length > 0 && members.every(m => selectedMembers.has(m.id))}
                    onChange={() => {
                      const newSelected = new Set(selectedMembers);
                      if (members.every(m => selectedMembers.has(m.id))) {
                        members.forEach(m => newSelected.delete(m.id));
                      } else {
                        members.forEach(m => newSelected.add(m.id));
                      }
                      setSelectedMembers(newSelected);
                    }}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Highest role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workspaces
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last active
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((member) => (
                <tr 
                  key={member.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleUserClick(member)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={selectedMembers.has(member.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedMembers);
                        if (newSelected.has(member.id)) {
                          newSelected.delete(member.id);
                        } else {
                          newSelected.add(member.id);
                        }
                        setSelectedMembers(newSelected);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {member.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{member.role}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{member.workspaces}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{member.lastActive}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <UserDetailDialog
          user={selectedUser}
          roles={roles}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

export default MembersPage; 