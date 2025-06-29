'use client';

import { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import axios from 'axios';

interface Notice {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NoticeModal({ isOpen, onClose }: NoticeModalProps) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [internalVisible, setInternalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/notices');
      const activeNotices = response.data.notices;
      
      if (activeNotices && activeNotices.length > 0) {
        setNotices(activeNotices);
        setInternalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentNoticeIndex < notices.length - 1) {
      setCurrentNoticeIndex(currentNoticeIndex + 1);
    } else {
      setInternalVisible(false);
      setCurrentNoticeIndex(0);
    }
  };

  const handleClose = () => {
    setInternalVisible(false);
    setCurrentNoticeIndex(0);
    onClose();
  };

  useEffect(() => {
    if (isOpen && notices.length > 0) {
      setInternalVisible(true);
    }
  }, [isOpen, notices.length]);

  if (loading || notices.length === 0) {
    return null;
  }

  const currentNotice = notices[currentNoticeIndex];

  return (
    <Modal
      title={<span className="text-lg font-bold">{currentNotice.title}</span>}
      open={isOpen && internalVisible}
      onCancel={handleClose}
      footer={[
        <div key="footer" className="flex justify-between items-center w-full">
          <span className="text-sm text-gray-400">
            {currentNoticeIndex + 1} of {notices.length}
          </span>
          <div>
            <Button onClick={handleClose} className="mr-2">
              Close
            </Button>
            {currentNoticeIndex < notices.length - 1 ? (
              <Button type="primary" onClick={handleNext} className="bg-blue-500">
                Next
              </Button>
            ) : (
              <Button type="primary" onClick={handleClose} className="bg-blue-500">
                Done
              </Button>
            )}
          </div>
        </div>
      ]}
      width={600}
      centered
    >
      <div className="py-4 whitespace-pre-wrap">{currentNotice.content}</div>
      <div className="text-sm text-gray-500 mt-4">Posted: {new Date(currentNotice.createdAt).toLocaleString()}</div>
    </Modal>
  );
}
