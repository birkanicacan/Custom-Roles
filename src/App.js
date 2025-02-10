import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

function App() {
  const [roles, setRoles] = useState([
    { 
      id: 1, 
      name: 'Organization Owner', 
      type: 'System role', 
      description: 'Full access to all workspaces and organization settings',
      isSystemRole: true,
      assignedMembers: [
        {
          id: 1,
          name: 'Birkan Icacan',
          email: 'birkan@makenotion.com',
          workspaces: 'All organizational workspaces',
          lastModified: 'Feb 7, 2025',
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@makenotion.com',
          workspaces: 'All organizational workspaces',
          lastModified: 'Feb 6, 2025',
        }
      ],
      permissions: {
        'Manage Organization': [
          'View and manage organization settings'
        ],
        'Manage membership': [
          'View the list of workspace members in Settings dialog',
          'Add a new member',
          'Update a member\'s role',
          'Remove members from the workspace',
          'Export members list',
          'Manage membership requests'
        ],
      }
    },
    { 
      id: 2, 
      name: 'Workspace Owner', 
      type: 'System role', 
      description: 'Can manage workspace settings and members',
      isSystemRole: true,
      assignedMembers: [
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@makenotion.com',
          workspaces: 'Marketing, Sales, Engineering',
          lastModified: 'Feb 6, 2025',
        },
        {
          id: 4,
          name: 'Sarah Wilson',
          email: 'sarah@makenotion.com',
          workspaces: 'Design, Product',
          lastModified: 'Feb 5, 2025',
        }
      ],
    },
    { 
      id: 3, 
      name: 'Membership Admin', 
      type: 'System role', 
      description: 'Can manage organization members and their roles',
      isSystemRole: true,
      assignedMembers: [
        {
          id: 5,
          name: 'Alex Brown',
          email: 'alex@makenotion.com',
          workspaces: 'All organizational workspaces',
          lastModified: 'Feb 4, 2025',
        },
        {
          id: 6,
          name: 'Emily Davis',
          email: 'emily@makenotion.com',
          workspaces: 'All organizational workspaces',
          lastModified: 'Feb 3, 2025',
        }
      ],
    },
    { 
      id: 4, 
      name: 'Member', 
      type: 'System role', 
      description: 'Basic access to assigned workspaces',
      isSystemRole: true,
      assignedMembers: [
        {
          id: 7,
          name: 'David Lee',
          email: 'david@makenotion.com',
          workspaces: 'Marketing',
          lastModified: 'Feb 2, 2025',
        },
      ],
    },
    { 
      id: 5, 
      name: 'Knowledge Base Manager', 
      type: 'Custom role', 
      description: 'Can view members and access all analytics data',
      isSystemRole: false,
      assignedMembers: [
        {
          id: 9,
          name: 'Chris Taylor',
          email: 'chris@makenotion.com',
          workspaces: 'Product, Design',
          lastModified: 'Jan 31, 2025',
        },
        {
          id: 10,
          name: 'Rachel Kim',
          email: 'rachel@makenotion.com',
          workspaces: 'Marketing, Sales',
          lastModified: 'Jan 30, 2025',
        }
      ],
    }
  ]);

  const handleRolesChange = (updatedRoles) => {
    setRoles(updatedRoles);
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <MainContent roles={roles} onRolesChange={handleRolesChange} />
      </div>
    </Router>
  );
}

export default App; 