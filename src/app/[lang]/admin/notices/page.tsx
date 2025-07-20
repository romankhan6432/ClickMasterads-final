'use client';

import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Switch, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Notice {
  _id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NoticeFormValues {
  title: string;
  content: string;
  isActive: boolean;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const { TextArea } = Input;

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/notices');
      setNotices(response.data.notices);
    } catch (error) {
      console.error('Error fetching notices:', error);
      message.error('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (values: NoticeFormValues) => {
    try {
      if (editingNotice) {
        // Update existing notice
        await axios.put(`/api/admin/notices/${editingNotice._id}`, values);
        message.success('Notice updated successfully');
      } else {
        // Create new notice
        await axios.post('/api/admin/notices', values);
        message.success('Notice created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      setEditingNotice(null);
      fetchNotices();
    } catch (error) {
      console.error('Error saving notice:', error);
      message.error('Failed to save notice');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/notices/${id}`);
      message.success('Notice deleted successfully');
      fetchNotices();
    } catch (error) {
      console.error('Error deleting notice:', error);
      message.error('Failed to delete notice');
    }
  };

  const openEditModal = (record: Notice) => {
    setEditingNotice(record);
    form.setFieldsValue({
      title: record.title,
      content: record.content,
      isActive: record.isActive,
    });
    setModalVisible(true);
  };

  const openCreateModal = () => {
    setEditingNotice(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text: string) => (
        <div style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <span className={isActive ? 'text-green-500' : 'text-red-500'}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Notice) => (
        <div className="flex space-x-2">
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
              className="bg-blue-500"
            >
              Edit
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this notice?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Notices</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
          className="bg-green-500"
        >
          Add New Notice
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={notices}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        className="bg-gray-800 rounded-lg overflow-hidden"
      />

      <Modal
        title={editingNotice ? 'Edit Notice' : 'Create Notice'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateOrUpdate}
          initialValues={{ isActive: true }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Enter notice title" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please enter content' }]}
          >
            <TextArea rows={4} placeholder="Enter notice content" />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end space-x-2">
              <Space> <Button onClick={() => setModalVisible(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit" className="bg-blue-500">
                  {editingNotice ? 'Update' : 'Create'}
                </Button></Space>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
