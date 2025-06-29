        'use client';

import { Modal, Form, Input, Select, Button, Space } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/modules/store';
 
interface AddUserModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

export default function AddUserModal({ open, onCancel, onSuccess }: AddUserModalProps) {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { loading, error } = useSelector((state: RootState) => state.public.auth);

    const handleSubmit = (values: any) => {
        ///dispatch(createUserRequest(values));
    };

    // Watch for changes in loading and error states
    useEffect(() => {
        if (!loading && !error) {
            form.resetFields();
            onSuccess();
        }
    }, [loading, error, form, onSuccess]);

    return (
        <Modal
            title="Add New User"
            open={open}
            onCancel={onCancel}
            footer={null}
            maskClosable={false}
            className="user-modal"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
                className="user-form"
            >
                <Form.Item
                    name="fullName"
                    label="Full Name"
                    rules={[
                        { required: true, message: 'Please enter full name' },
                        { min: 3, message: 'Full name must be at least 3 characters' }
                    ]}
                >
                    <Input 
                        prefix={<UserOutlined />} 
                        placeholder="Enter full name"
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please enter email' },
                        { type: 'email', message: 'Please enter a valid email' }
                    ]}
                >
                    <Input 
                        prefix={<MailOutlined />} 
                        placeholder="Enter email"
                    />
                </Form.Item>

                <Form.Item
                    name="telegramId"
                    label="Telegram ID"
                    rules={[
                        { required: true, message: 'Please enter Telegram ID' },
                        { pattern: /^@?[\w\d_]{5,32}$/, message: 'Please enter a valid Telegram ID' }
                    ]}
                >
                    <Input 
                        prefix="@"
                        placeholder="username"
                    />
                </Form.Item>

                <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: 'Please select role' }]}
                >
                    <Select placeholder="Select role">
                        <Select.Option value="admin">Admin</Select.Option>
                        <Select.Option value="moderator">Moderator</Select.Option>
                        <Select.Option value="user">User</Select.Option>
                    </Select>
                </Form.Item>

                {error && (
                    <Form.Item>
                        <div className="text-red-500">{error}</div>
                    </Form.Item>
                )}
                <Form.Item className="mb-0">
                    <Space className="w-full justify-end">
                        <Button onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Create User
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}
