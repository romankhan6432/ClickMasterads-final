'use client';

import { useState, useEffect } from 'react';
import { Card, Spin } from 'antd';
import axios from 'axios';

interface Notice {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/notices');
      setNotices(response.data.notices);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Notices</h1>
      
      {notices.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400">No notices available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1">
          {notices.map((notice) => (
            <Card 
              key={notice._id}
              title={<span className="text-lg font-bold">{notice.title}</span>}
              className="bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
              headStyle={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              <div className="whitespace-pre-wrap">{notice.content}</div>
              <div className="mt-4 text-sm text-gray-400">
                Posted: {new Date(notice.createdAt).toLocaleString()}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
