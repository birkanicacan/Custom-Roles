import React, { useState } from 'react';
import { EllipsisVerticalIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import CreateRoleDialog from './CreateRoleDialog';
import RoleDetailView from './RoleDetailView';

// Define PERMISSION_CATEGORIES here since it's used in multiple components
export const PERMISSION_CATEGORIES = {
  'Manage Organization': {
    description: 'Control organization settings',
    permissions: [
      { id: 'manage_org', name: 'View and manage organization settings' },
    ]
  },
  'Manage membership': {
    description: 'Control member access and roles',
    permissions: [
      { id: 'view_members', name: 'View the list of workspace members in Settings dialog' },
      { id: 'add_members', name: 'Add a new member' },
      { id: 'update_member_role', name: 'Update a member\'s role' },
      { id: 'remove_members', name: 'Remove members from the workspace' },
      { id: 'export_members', name: 'Export members list' },
      { id: 'manage_requests', name: 'Manage membership requests' },
    ]
  },
  'Manage groups': {
    description: 'Control permission groups',
    permissions: [
      { id: 'view_groups', name: 'View the list of permission groups in Settings dialog' },
      { id: 'manage_groups', name: 'Create, manage and delete permission groups' },
    ]
  },
  'Manage guests': {
    description: 'Control guest access',
    permissions: [
      { id: 'view_guests', name: 'View the list of guests in Settings dialog' },
      { id: 'manage_guests', name: 'Manage guests, such as convert a guest to a member and remove a guest' },
      { id: 'manage_guest_requests', name: 'Manage guest invite requests' },
    ]
  },
  'Manage user roles': {
    description: 'Control user roles',
    permissions: [
      { id: 'manage_roles', name: 'View and manage user roles' },
    ]
  },
  'Manage Teamspaces': {
    description: 'Control Teamspace settings',
    permissions: [
      { id: 'manage_teamspaces', name: 'View Teamspaces tab in Settings dialog, and manage related settings' },
    ]
  },
  'Analytics': {
    description: 'Access analytics data',
    permissions: [
      { id: 'view_analytics', name: 'View the Workspace Analytics tab in Settings dialog' },
      { id: 'view_overview', name: 'View the Overview tab' },
      { id: 'view_member_analytics', name: 'View the Members tab and export as CSV' },
      { id: 'view_content_analytics', name: 'View Content tab and export as CSV' },
      { id: 'view_search_analytics', name: 'View Search tab and export as CSV' },
    ]
  },
  'Manage security & data retention': {
    description: 'Control security settings',
    permissions: [
      { id: 'manage_security', name: 'View and manage the security settings' },
      { id: 'manage_retention', name: 'View and manage the data retention settings' },
      { id: 'manage_legal_holds', name: 'View and manage the legal holds' },
    ]
  },
  'Identity & provisioning': {
    description: 'Control identity settings',
    permissions: [
      { id: 'manage_identity', name: 'Manage identity & provisioning settings, such as domain management, managed users controls, SAML SSO and SCIM' },
    ]
  },
  'Manage content search': {
    description: 'Control search settings',
    permissions: [
      { id: 'view_search', name: 'View content search tab in Settings dialog, conduct search queries and export as CSV' },
      { id: 'change_permissions', name: 'Use admin privilege to change page permission' },
    ]
  },
  'Manage Connections': {
    description: 'Control integration settings',
    permissions: [
      { id: 'manage_connections', name: 'View Connections tab in Settings dialog and manage related settings' },
      { id: 'create_integrations', name: 'Create internal integrations' },
    ]
  },
  'Imports': {
    description: 'Control import settings',
    permissions: [
      { id: 'manage_imports', name: 'View the Import tab in Settings dialog and /slash menu, and import data from apps and files into Notion' },
    ]
  },
  'Audit Log': {
    description: 'Access audit logs',
    permissions: [
      { id: 'view_audit_logs', name: 'View Audit Logs and export as CSV' },
    ]
  },
  'Billing': {
    description: 'Control billing settings',
    permissions: [
      { id: 'manage_billing', name: 'View and manage Billing settings' },
      { id: 'manage_plans', name: 'View Explore plans tab in Settings dialog, update or request to upgrade pricing plan' },
    ]
  },
};

// Define permission dependencies
export const PERMISSION_DEPENDENCIES = {
  'add_members': ['view_members'],
  'update_member_role': ['view_members'],
  'remove_members': ['view_members'],
  'export_members': ['view_members'],
  'manage_requests': ['view_members'],
  'manage_groups': ['view_groups'],
  'manage_guests': ['view_guests'],
};

function UserRolesPage({ roles, onRolesChange }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);

  const handleCreateRole = (newRole) => {
    // Convert the permissions array into the same structure as system roles
    const permissionsByCategory = {};
    newRole.permissions.forEach(permission => {
      // Find which category this permission belongs to
      for (const [category, data] of Object.entries(PERMISSION_CATEGORIES)) {
        const found = data.permissions.find(p => p.id === permission);
        if (found) {
          if (!permissionsByCategory[category]) {
            permissionsByCategory[category] = [];
          }
          permissionsByCategory[category].push(found.name);
          break;
        }
      }
    });

    // Get all existing members from the roles
    const existingMembers = roles.reduce((acc, role) => {
      role.assignedMembers?.forEach(member => {
        if (!acc.find(m => m.id === member.id)) {
          acc.push(member);
        }
      });
      return acc;
    }, []);

    // Get the selected members' details
    const assignedMembers = newRole.members.map(memberId => {
      const member = existingMembers.find(m => m.id === memberId);
      return {
        id: member.id,
        name: member.name,
        email: member.email,
        workspaces: member.workspaces,
        lastModified: new Date().toLocaleDateString('en-US', { 
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      };
    });

    const roleToAdd = {
      id: roles.length + 1,
      name: newRole.name,
      type: 'Custom role',
      description: newRole.description,
      isSystemRole: false,
      permissions: permissionsByCategory,
      assignedMembers: assignedMembers
    };
    
    onRolesChange([...roles, roleToAdd]);
    setShowCreateDialog(false);
  };

  const handleDeleteRole = (roleId) => {
    onRolesChange(roles.filter(role => role.id !== roleId));
    setShowDeleteDialog(false);
    setSelectedRole(null);
    setShowDetailView(false);
  };

  const DeleteConfirmationDialog = ({ role, onClose }) => (
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
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteRole(role.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
          >
            Delete role
          </button>
        </div>
      </div>
    </div>
  );

  const RoleActions = ({ role }) => {
    const [showActions, setShowActions] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-1.5 rounded-md hover:bg-gray-100"
        >
          <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
        </button>

        {showActions && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-1">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Manage assigned members
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Edit role
              </button>
              <button
                onClick={() => {
                  if (!role.isSystemRole) {
                    setSelectedRole(role);
                    setShowDeleteDialog(true);
                    setShowActions(false);
                  }
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  role.isSystemRole
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-red-600 hover:bg-gray-50'
                }`}
              >
                Delete role
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-6">
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500 mb-4 space-x-2">
            <Link to="/" className="hover:text-gray-900">People</Link>
            <span>/</span>
            <span className="text-gray-900">Manage user roles</span>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-[22px] font-medium text-gray-900">Manage user roles</h1>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="px-4 py-2 bg-[#2381fe] text-white rounded-md hover:bg-blue-600 font-medium text-sm"
            >
              Create role
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Role type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Member count
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roles.map((role) => (
                <tr
                  key={role.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedRole(role);
                    setShowDetailView(true);
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{role.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      role.isSystemRole ? 'bg-gray-100 text-gray-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {role.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">{role.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {(role.assignedMembers?.length || 0)} members
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <RoleActions role={role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteDialog && selectedRole && (
        <DeleteConfirmationDialog
          role={selectedRole}
          onClose={() => {
            setShowDeleteDialog(false);
            setSelectedRole(null);
          }}
        />
      )}

      {showCreateDialog && (
        <CreateRoleDialog
          onClose={() => setShowCreateDialog(false)}
          onCreateRole={handleCreateRole}
        />
      )}

      {showDetailView && selectedRole && (
        <RoleDetailView
          role={selectedRole}
          onClose={() => {
            setShowDetailView(false);
            setSelectedRole(null);
          }}
          onDelete={handleDeleteRole}
        />
      )}
    </div>
  );
}

export default UserRolesPage; 