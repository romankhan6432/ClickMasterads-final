"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag, Button, Spin, Result } from 'antd';
import { ThunderboltOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import AdminLayout from '../../layout';
import { API_CALL } from '@/lib/client';

export default function WithdrawalDetailsPage() {
  const { id  } = useParams();
  const router = useRouter();
  const [withdrawal, setWithdrawal] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(false);
      try {
        const { response, status } = await API_CALL({ url: `/withdrawals/${id}` });
        if (status === 200 && response ) {
          setWithdrawal(response.result);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  

  if (loading) {
    return <AdminLayout><div className="flex justify-center items-center min-h-[300px]"><Spin size="large" /></div></AdminLayout>;
  }
  if (error || !withdrawal) {
    return (
      <AdminLayout>
        <Result
          status="404"
          title="Withdrawal Not Found"
          subTitle="The withdrawal request you are looking for does not exist."
          extra={<Button type="primary" onClick={() => router.push(`/admin/withdrawals`)} icon={<ArrowLeftOutlined />}>Back to List</Button>}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ThunderboltOutlined style={{ color: '#fff', fontSize: 22 }} />
            <span style={{ fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: 1 }}>Withdrawal Details</span>
            <Tag color={
              withdrawal.status === 'approved' ? 'green' :
                withdrawal.status === 'rejected' ? 'red' : 'gold'
            } style={{ marginLeft: 'auto', fontWeight: 600, fontSize: 15 }}>
              {withdrawal.status ? withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1) : 'Pending'}
            </Tag>
          </div>
        }
        extra={<Button icon={<ArrowLeftOutlined />} onClick={() => router.push(`/admin/withdrawals`)} size="large" style={{ fontWeight: 600 }}>Back</Button>}
        style={{ width: '100%', maxWidth: '100%', margin: '40px 0', borderRadius: 0, background: '#181818', boxShadow: 'none', border: 'none' }}
        bordered={false}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ padding: 0 }}>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: 16, margin: 0, letterSpacing: 1, padding: '18px 24px 12px 24px', borderBottom: '1px solid #222' }}>User Info</div>
          <Descriptions
            column={2}
            labelStyle={{ fontWeight: 700, color: '#fff', fontSize: 14, padding: 0, margin: 0 }}
            contentStyle={{ color: '#fff', fontSize: 14, padding: 0, margin: 0 }}
            layout="vertical"
            style={{ margin: 0, padding: '0 24px' }}
          >
            <Descriptions.Item label="Username">
              {withdrawal.userId?.username ?? 'N/A'}<br />
              <span style={{ color: '#fff', fontSize: 12 }}>{withdrawal.userId?.email ?? ''}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Telegram ID">
              <span style={{ fontFamily: 'monospace', color: '#fff' }}>{withdrawal.telegramId || 'N/A'}</span>
            </Descriptions.Item>
          </Descriptions>
          <div style={{ borderTop: '1px solid #222', margin: 0 }} />

          <div style={{ fontWeight: 700, color: '#fff', fontSize: 16, margin: 0, letterSpacing: 1, padding: '18px 24px 12px 24px', borderBottom: '1px solid #222' }}>Withdrawal Info</div>
          <Descriptions
            column={2}
            labelStyle={{ fontWeight: 700, color: '#fff', fontSize: 14, padding: 0, margin: 0 }}
            contentStyle={{ color: '#fff', fontSize: 14, padding: 0, margin: 0 }}
            layout="vertical"
            style={{ margin: 0, padding: '0 24px' }}
          >
            <Descriptions.Item label="Amount">
              <span style={{ fontWeight: 700, color: '#52c41a', fontSize: 16 }}>
                {withdrawal.metadata?.originalAmount} {withdrawal.metadata?.currency?.toUpperCase()}
              </span>
              <span style={{ color: '#fff', marginLeft: 8 }}>
                (Net: {withdrawal.metadata?.amountAfterFee} {withdrawal.metadata?.currency?.toUpperCase()})
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">
              {withdrawal.method?.toUpperCase() || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Recipient">
              <span style={{ fontFamily: 'monospace', color: '#fff' }}>{withdrawal.recipient || 'N/A'}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {withdrawal.createdAt ? new Date(withdrawal.createdAt).toLocaleString() : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
          <div style={{ borderTop: '1px solid #222', margin: 0 }} />

          <div style={{ fontWeight: 700, color: '#fff', fontSize: 16, margin: 0, letterSpacing: 1, padding: '18px 24px 12px 24px', borderBottom: '1px solid #222' }}>Technical Info</div>
          <Descriptions
            column={2}
            labelStyle={{ fontWeight: 700, color: '#fff', fontSize: 14, padding: 0, margin: 0 }}
            contentStyle={{ color: '#fff', fontSize: 13, padding: 0, margin: 0 }}
            layout="vertical"
            style={{ margin: 0, padding: '0 24px 18px 24px' }}
          >
            <Descriptions.Item label="IP Address">
              {withdrawal.metadata?.ipAddress || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Device Info">
              <span style={{ fontSize: 11, color: '#fff' }}>{withdrawal.metadata?.deviceInfo || 'N/A'}</span>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Card>
    </AdminLayout>
  );
}
