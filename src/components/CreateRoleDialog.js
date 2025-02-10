import React, { useState } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PERMISSION_CATEGORIES, PERMISSION_DEPENDENCIES } from './UserRolesPage';

function CreateRoleDialog({ onClose, onCreateRole }) {
  const [step, setStep] = useState(1);
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Use the same members data as in MembersPage
  const members = [
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
    }
  ];

  const handlePermissionToggle = (permissionId) => {
    const newPermissions = new Set(selectedPermissions);
    
    if (newPermissions.has(permissionId)) {
      newPermissions.delete(permissionId);
    } else {
      newPermissions.add(permissionId);
      // Add dependent permissions
      if (PERMISSION_DEPENDENCIES[permissionId]) {
        PERMISSION_DEPENDENCIES[permissionId].forEach(depId => {
          newPermissions.add(depId);
        });
      }
    }
    
    setSelectedPermissions(newPermissions);
  };

  const handleCategoryToggle = (permissions) => {
    const allSelected = permissions.every(p => selectedPermissions.has(p.id));
    const newPermissions = new Set(selectedPermissions);
    
    permissions.forEach(permission => {
      if (allSelected) {
        newPermissions.delete(permission.id);
      } else {
        newPermissions.add(permission.id);
        // Add dependent permissions
        if (PERMISSION_DEPENDENCIES[permission.id]) {
          PERMISSION_DEPENDENCIES[permission.id].forEach(depId => {
            newPermissions.add(depId);
          });
        }
      }
    });
    
    setSelectedPermissions(newPermissions);
  };

  const isPermissionDisabled = (permissionId) => {
    // Check if this permission is required by any selected permission
    return Object.entries(PERMISSION_DEPENDENCIES).some(([key, deps]) => 
      selectedPermissions.has(key) && deps.includes(permissionId)
    );
  };

  const filteredCategories = Object.entries(PERMISSION_CATEGORIES).filter(([category, data]) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      category.toLowerCase().includes(searchLower) ||
      data.description.toLowerCase().includes(searchLower) ||
      data.permissions.some(p => p.name.toLowerCase().includes(searchLower))
    );
  });

  const filteredMembers = members.filter(member => {
    if (!memberSearchQuery) return true;
    const searchLower = memberSearchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower) ||
      member.role.toLowerCase().includes(searchLower) ||
      member.workspaces.toLowerCase().includes(searchLower)
    );
  });

  const handleMemberToggle = (memberId) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const handleSubmit = () => {
    const newRole = {
      name: roleName,
      description,
      permissions: Array.from(selectedPermissions),
      members: Array.from(selectedMembers),
    };
    
    onCreateRole(newRole);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {step === 1 ? 'Create new role' : 'Assign members'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {step === 1 ? (
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role name
                  </label>
                  <input
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter role name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the purpose of this role"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Permissions
                    </label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search permissions"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {filteredCategories.map(([category, { description, permissions }]) => (
                      <div key={category} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start mb-4">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              checked={permissions.every(p => selectedPermissions.has(p.id))}
                              onChange={() => handleCategoryToggle(permissions)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3">
                            <label className="font-medium text-gray-900">{category}</label>
                            <p className="text-sm text-gray-500">{description}</p>
                          </div>
                        </div>
                        <div className="ml-7 space-y-3">
                          {permissions.map((permission) => {
                            const isDisabled = isPermissionDisabled(permission.id);
                            return (
                              <div key={permission.id} className="flex items-start">
                                <div className="flex items-center h-5">
                                  <input
                                    type="checkbox"
                                    checked={selectedPermissions.has(permission.id)}
                                    onChange={() => handlePermissionToggle(permission.id)}
                                    disabled={isDisabled}
                                    className={`h-4 w-4 border-gray-300 rounded ${
                                      isDisabled
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-blue-600'
                                    }`}
                                  />
                                </div>
                                <label className={`ml-3 text-sm ${
                                  isDisabled ? 'text-gray-400' : 'text-gray-700'
                                }`}>
                                  {permission.name}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search members"
                  />
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                        <input
                          type="checkbox"
                          checked={filteredMembers.length > 0 && filteredMembers.every(m => selectedMembers.has(m.id))}
                          onChange={() => {
                            const allSelected = filteredMembers.every(m => selectedMembers.has(m.id));
                            const newSelected = new Set(selectedMembers);
                            filteredMembers.forEach(member => {
                              if (allSelected) {
                                newSelected.delete(member.id);
                              } else {
                                newSelected.add(member.id);
                              }
                            });
                            setSelectedMembers(newSelected);
                          }}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Workspaces
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMembers.map((member) => (
                      <tr
                        key={member.id}
                        onClick={() => {
                          const newSelected = new Set(selectedMembers);
                          if (newSelected.has(member.id)) {
                            newSelected.delete(member.id);
                          } else {
                            newSelected.add(member.id);
                          }
                          setSelectedMembers(newSelected);
                        }}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedMembers.has(member.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              const newSelected = new Set(selectedMembers);
                              if (newSelected.has(member.id)) {
                                newSelected.delete(member.id);
                              } else {
                                newSelected.add(member.id);
                              }
                              setSelectedMembers(newSelected);
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{member.role}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{member.workspaces}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              Back
            </button>
          )}
          <div className="flex space-x-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (step === 1) {
                  if (!roleName || !description || selectedPermissions.size === 0) {
                    alert('Please fill in all required fields');
                    return;
                  }
                  setStep(2);
                } else {
                  handleSubmit();
                }
              }}
              className="px-4 py-2 bg-[#2381fe] text-white text-sm font-medium rounded-md hover:bg-blue-600"
            >
              {step === 1 ? 'Next' : 'Create role'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRoleDialog; 