import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EllipsisVerticalIcon,
  XMarkIcon,
  ChevronRightIcon,
  PencilIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import CreateRoleDialog from './CreateRoleDialog';
import { PERMISSION_CATEGORIES, PERMISSION_DEPENDENCIES } from './UserRolesPage';

function AssignMembersDialog({ onClose, onAssign, existingMembers, allMembers }) {
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  const filteredMembers = allMembers.filter(member => {
    // Filter out already assigned members
    if (existingMembers.has(member.id)) return false;
    
    if (!memberSearchQuery) return true;
    const searchLower = memberSearchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower) ||
      member.workspaces.some(w => w.toLowerCase().includes(searchLower))
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Assign members</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
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
                    Full Name
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
                    onClick={() => handleMemberToggle(member.id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedMembers.has(member.id)}
                        onChange={() => handleMemberToggle(member.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{member.workspaces.join(', ')}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-end p-6 border-t border-gray-200 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onAssign(Array.from(selectedMembers));
              onClose();
            }}
            className="px-4 py-2 bg-[#2381fe] text-white text-sm font-medium rounded-md hover:bg-blue-600"
          >
            Assign members
          </button>
        </div>
      </div>
    </div>
  );
}

function EditPermissionsDialog({ role, onClose, onSave }) {
  const [selectedPermissions, setSelectedPermissions] = useState(() => {
    // Convert the role's permissions back to IDs
    const permissionIds = new Set();
    
    // For each permission in the role
    Object.entries(role.permissions || {}).forEach(([category, permissions]) => {
      // Find matching permission IDs from PERMISSION_CATEGORIES
      const categoryData = PERMISSION_CATEGORIES[category];
      if (categoryData) {
        permissions.forEach(permissionName => {
          const permission = categoryData.permissions.find(p => p.name === permissionName);
          if (permission) {
            permissionIds.add(permission.id);
          }
        });
      }
    });
    
    return permissionIds;
  });
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSave = () => {
    // Convert the selected permission IDs back to the role permissions format
    const permissionsByCategory = {};
    Object.entries(PERMISSION_CATEGORIES).forEach(([category, { permissions }]) => {
      const selectedPermsInCategory = permissions
        .filter(p => selectedPermissions.has(p.id))
        .map(p => p.name);
      
      if (selectedPermsInCategory.length > 0) {
        permissionsByCategory[category] = selectedPermsInCategory;
      }
    });

    onSave(permissionsByCategory);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit permissions</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
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

        <div className="flex items-center justify-end p-6 border-t border-gray-200 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#2381fe] text-white text-sm font-medium rounded-md hover:bg-blue-600"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleDetailView({ role, onClose, onDelete }) {
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditPermissionsDialog, setShowEditPermissionsDialog] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [assignedMembers, setAssignedMembers] = useState(role.assignedMembers || []);
  const [permissions, setPermissions] = useState(role.permissions || {});

  // Mock member data for the assign dialog
  const allMembers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', workspaces: ['Marketing', 'Sales'] },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', workspaces: ['Engineering'] },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', workspaces: ['Design', 'Product'] },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', workspaces: ['Marketing'] },
  ];

  // Update parent component when members change
  const updateParentMembers = (newMembers) => {
    role.assignedMembers = newMembers;
    setAssignedMembers(newMembers);
  };

  const handleRevokeMember = (memberId) => {
    const newMembers = assignedMembers.filter(member => member.id !== memberId);
    updateParentMembers(newMembers);
  };

  const handleBulkRevoke = () => {
    const newMembers = assignedMembers.filter(member => !selectedMembers.has(member.id));
    updateParentMembers(newMembers);
    setSelectedMembers(new Set());
  };

  const handleAssignMembers = (memberIds) => {
    // Get the member details for the selected IDs
    const newMembers = memberIds.map(id => {
      const member = allMembers.find(m => m.id === id);
      return {
        id: member.id,
        name: member.name,
        email: member.email,
        workspaces: member.workspaces.join(', '),
        lastModified: new Date().toLocaleDateString('en-US', { 
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      };
    });

    // Filter out any members that are already assigned
    const uniqueNewMembers = newMembers.filter(
      newMember => !assignedMembers.some(
        existingMember => existingMember.id === newMember.id
      )
    );

    // Update both local and parent state
    const updatedMembers = [...assignedMembers, ...uniqueNewMembers];
    updateParentMembers(updatedMembers);
    setShowAssignDialog(false);
  };

  const handleSavePermissions = (newPermissions) => {
    role.permissions = newPermissions;
    setPermissions(newPermissions);
    setShowEditPermissionsDialog(false);
  };

  const DeleteConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md shadow-xl">
        <h3 className="text-lg font-semibold mb-2">Delete Role</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete the "{role.name}" role? All {role.memberCount} members 
          assigned to this role will be automatically converted to Members unless they are assigned 
          to a different role.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowDeleteDialog(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDelete(role.id);
              setShowDeleteDialog(false);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
          >
            Delete role
          </button>
        </div>
      </div>
    </div>
  );

  const MemberActions = ({ member }) => {
    const [showActions, setShowActions] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent row selection when clicking the menu
            setShowActions(!showActions);
          }}
          className="p-1.5 rounded-md hover:bg-gray-100"
        >
          <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
        </button>

        {showActions && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row selection when clicking the button
                  handleRevokeMember(member.id);
                  setShowActions(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
              >
                Revoke role
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-[1200px] mx-auto px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-sm text-gray-500 space-x-2">
              <button
                onClick={onClose}
                className="hover:text-gray-900"
              >
                Roles
              </button>
              <ChevronRightIcon className="w-4 h-4" />
              <span className="text-gray-900">{role.name}</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-medium text-gray-900 mb-1">{role.name}</h1>
              <p className="text-gray-600">{role.description}</p>
            </div>
            {!role.isSystemRole && (
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="px-4 py-2 text-red-600 font-medium text-sm hover:text-red-700"
              >
                Delete role
              </button>
            )}
          </div>
        </div>

        {/* Role Stats */}
        <div className="mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500">
              Total members with this role
            </div>
            <div className="text-2xl font-medium text-gray-900">
              {assignedMembers.length}
            </div>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium text-gray-900">Permissions</h2>
            <button
              onClick={() => setShowEditPermissionsDialog(true)}
              className="inline-flex items-center text-sm text-[#2381fe] hover:text-blue-700"
            >
              <PencilIcon className="w-4 h-4 mr-1" />
              Edit permissions
            </button>
          </div>
          <div className="space-y-4">
            {Object.entries(permissions || {}).map(([category, perms]) => (
              perms.length > 0 && (
                <div key={category} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{category}</h3>
                  <ul className="space-y-2">
                    {perms.map((permission) => (
                      <li key={permission} className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2 text-[#2381fe]">✓</span>
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
            {(!permissions || Object.keys(permissions).length === 0) && (
              <div className="text-sm text-gray-500 italic">
                No permissions assigned to this role.
              </div>
            )}
          </div>
        </div>

        {/* Members Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium text-gray-900">Assigned members</h2>
            <button
              onClick={() => setShowAssignDialog(true)}
              className="inline-flex items-center px-4 py-2 bg-[#2381fe] text-white rounded-md hover:bg-blue-600 text-sm font-medium"
            >
              <UserPlusIcon className="w-4 h-4 mr-2" />
              Assign members
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                    <input
                      type="checkbox"
                      checked={assignedMembers.length > 0 && assignedMembers.every(m => selectedMembers.has(m.id))}
                      onChange={() => {
                        const newSelected = new Set(selectedMembers);
                        if (assignedMembers.every(m => selectedMembers.has(m.id))) {
                          assignedMembers.forEach(m => newSelected.delete(m.id));
                        } else {
                          assignedMembers.forEach(m => newSelected.add(m.id));
                        }
                        setSelectedMembers(newSelected);
                      }}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workspaces
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last modified
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assignedMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedMembers.has(member.id)}
                        onChange={() => {
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
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{member.workspaces}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{member.lastModified}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <MemberActions member={member} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showDeleteDialog && <DeleteConfirmationDialog />}
      
      {showAssignDialog && (
        <AssignMembersDialog
          onClose={() => setShowAssignDialog(false)}
          onAssign={handleAssignMembers}
          existingMembers={new Set(assignedMembers.map(m => m.id))}
          allMembers={allMembers}
        />
      )}

      {showEditPermissionsDialog && (
        <EditPermissionsDialog
          role={role}
          onClose={() => setShowEditPermissionsDialog(false)}
          onSave={handleSavePermissions}
        />
      )}

      {selectedMembers.size > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedMembers.size} member{selectedMembers.size !== 1 ? 's' : ''} selected
            </div>
            <button
              onClick={handleBulkRevoke}
              className="px-4 py-2 text-red-600 font-medium text-sm hover:text-red-700"
            >
              Revoke role
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoleDetailView; 