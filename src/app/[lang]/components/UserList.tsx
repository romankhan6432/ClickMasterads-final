import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Space, Input, Select, message, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { User, UserFilters } from '../services/api';
 
import { useAppSelector } from '../hooks/useAppSelector';
 
import { 
  DeleteOutlined, 
  EditOutlined, 
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import Link from 'next/link';
import { useDispatch } from 'react-redux';

interface UserListProps {
  onEdit?: (user: User) => void;
}

interface ExtendedUserFilters extends UserFilters {
  role?: string;
  sortField?: string;
  sortOrder?: string;
}

const { Search } = Input;
const { Option } = Select;

const UserList: React.FC<UserListProps> = ({ onEdit }) => {
  const dispatch = useDispatch();
  const { users, loading, total, currentPage, pageSize } = useAppSelector(state => state.private.user);
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<string>('');

  const loadUsers = React.useCallback((page = 1) => {
    try {
      const filters: ExtendedUserFilters = {
        page,
        pageSize: 10,
        search: searchText,
        status: selectedStatus || undefined
      };
      
      if (selectedRole) {
        filters.role = selectedRole;
      }

      //dispatch(fetchUsersRequest(filters));
    } catch (error) {
      message.error('Failed to load users. Please try again.');
    }
  }, [dispatch, searchText, selectedRole, selectedStatus]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async (userId: string) => {
    try {
      setDeleteLoading(userId);
      //dispatch(deleteUserRequest(userId));
      message.success('User deleted successfully');
      loadUsers(currentPage);
    } catch (error) {
      message.error('Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading('');
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    loadUsers();
  };

  const handleRoleFilter = (value: string) => {
    setSelectedRole(value);
    loadUsers();
  };

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    loadUsers();
  };

  const handleRefresh = () => {
    setSearchText('');
    setSelectedRole('');
    setSelectedStatus('');
    loadUsers();
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: true,
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Telegram ID',
      dataIndex: 'telegramId',
      key: 'telegramId',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => (
        <a href={`mailto:${text}`} className="text-blue-500 hover:text-blue-700">
          {text}
        </a>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'User', value: 'user' },
        { text: 'Moderator', value: 'moderator' },
      ],
      render: (role: string) => (
        <span className={`px-2 py-1 rounded-full text-xs
          ${role === 'admin' ? 'bg-red-100 text-red-800' :
            role === 'moderator' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'}`}
        >
          {role}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      render: (status: string) => (
        <span className={`px-2 py-1 rounded-full text-xs
          ${status === 'active' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'}`}
        >
          {status}
        </span>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      sorter: true,
      render: (balance: number) => (
        <span className="font-medium">${balance.toFixed(2)}</span>
      ),
    },
    {
      title: 'Total Earnings',
      dataIndex: 'totalEarnings',
      key: 'totalEarnings',
      sorter: true,
      render: (earnings: number) => (
        <span className="font-medium">${earnings.toFixed(2)}</span>
      ),
    },
    {
      title: 'Ads Watched',
      dataIndex: 'adsWatched',
      key: 'adsWatched',
      sorter: true,
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (date: string) => (
        <span>{new Date(date).toLocaleDateString()}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Link 
              href={`/admin/users/${record.id}`}
              passHref
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <EyeOutlined />
            </Link>
          </Tooltip>
          
          {onEdit && (
            <Tooltip title="Edit User">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                aria-label={`Edit ${record.fullName}`}
              />
            </Tooltip>
          )}

          <Tooltip title="Delete User">
            <Popconfirm
              title="Delete User"
              description="Are you sure you want to delete this user?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                loading={deleteLoading === record.id}
                className="text-red-500 hover:text-red-700 transition-colors"
                aria-label={`Delete ${record.fullName}`}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<User> | SorterResult<User>[]
  ) => {
    try {
      const sortInfo = Array.isArray(sorter) ? sorter[0] : sorter;
      const filters: ExtendedUserFilters = {
        page: pagination.current || 1,
        pageSize: pagination.pageSize || 10,
        search: searchText,
        status: selectedStatus || undefined,
        sortField: sortInfo.field as string,
        sortOrder: sortInfo.order as string
      };

      if (selectedRole) {
        filters.role = selectedRole;
      }

      //dispatch(fetchUsersRequest(filters));
    } catch (error) {
      message.error('Failed to update table. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-center">
          <Search
            placeholder="Search users..."
            allowClear
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onSearch={handleSearch}
            className="w-64"
          />
          
          <Select
            placeholder="Filter by Role"
            allowClear
            value={selectedRole}
            onChange={handleRoleFilter}
            className="w-40"
          >
            <Option value="admin">Admin</Option>
            <Option value="user">User</Option>
            <Option value="moderator">Moderator</Option>
          </Select>

          <Select
            placeholder="Filter by Status"
            allowClear
            value={selectedStatus}
            onChange={handleStatusFilter}
            className="w-40"
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </div>

        <Button
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          className="hover:bg-gray-100 transition-colors"
        >
          Reset Filters
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users as any}
        rowKey="id"
        loading={loading}
        pagination={{
          total,
          current: currentPage,
          pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} users`,
          className: 'pagination-container'
        }}
        onChange={handleTableChange}
        className="bg-white rounded-lg shadow"
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default UserList;