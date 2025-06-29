'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Custom Icons
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
    <path d="M3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
    <path d="M3 16a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

// Toast notification component
const Toast = ({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error'; onClose: () => void }) => {
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
      <p>{message}</p>
      <button onClick={onClose} className="absolute top-1 right-1 text-white hover:text-gray-200">
        ×
      </button>
    </div>
  );
};

// Custom Modal component
const Modal = ({ isOpen, onClose, title, children, onConfirm }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full p-6 relative">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">{title}</h2>
        {children}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
}

export default function EmailTemplatesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to ClickMasterAds!',
      content: 'Hello {{username}},\n\nWelcome to ClickMasterAds! We\'re excited to have you on board.',
      variables: ['username']
    },
    {
      id: 'withdrawal',
      name: 'Withdrawal Confirmation',
      subject: 'Withdrawal Request Confirmed',
      content: 'Dear {{username}},\n\nYour withdrawal request for {{amount}} has been processed.',
      variables: ['username', 'amount']
    }
  ]);

  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;

    setLoading(true);
    // TODO: Implement API call to save template
    setTimeout(() => {
      if (editingTemplate.id === 'new') {
        setTemplates([...templates, { ...editingTemplate, id: Date.now().toString() }]);
      } else {
        setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
      }
      setLoading(false);
      setIsModalOpen(false);
      showToast('Template saved successfully');
    }, 1000);
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  const handleDeleteTemplate = (id: string) => {
    setDeleteConfirmation(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      setTemplates(templates.filter(t => t.id !== deleteConfirmation));
      showToast('Template deleted successfully');
      setDeleteConfirmation(null);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full p-6 relative">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Delete Template</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this template?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="ml-[5%] p-8">
      <div className="flex justify-between items-center mb-8 bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 transition-all duration-300">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center">
          <MailIcon />
          Email Templates
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 shadow-md"
          >
            <DashboardIcon />
            Dashboard
          </button>
          <button
            onClick={() => {
              setEditingTemplate({
                id: 'new',
                name: '',
                subject: '',
                content: '',
                variables: []
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 shadow-md"
          >
            <PlusIcon />
            New Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {templates.map(template => (
          <div key={template.id} className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-100">{template.name}</h2>
                <p className="text-gray-400 mt-1">Subject: {template.subject}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingTemplate(template);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200"
                >
                  <EditIcon />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200"
                >
                  <DeleteIcon />
                  Delete
                </button>
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">{template.content}</pre>
            </div>
            {template.variables.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Available Variables:</h3>
                <div className="flex gap-2 flex-wrap">
                  {template.variables.map(variable => (
                    <span
                      key={variable}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm"
                    >
                      {`{{${variable}}}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${editingTemplate?.id === 'new' ? 'New' : 'Edit'} Email Template`}
        onConfirm={handleSaveTemplate}
      >
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Template Name</label>
            <input
              type="text"
              value={editingTemplate?.name || ''}
              onChange={e => setEditingTemplate(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter template name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
            <input
              type="text"
              value={editingTemplate?.subject || ''}
              onChange={e => setEditingTemplate(prev => prev ? { ...prev, subject: e.target.value } : null)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email subject"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Content</label>
            <textarea
              value={editingTemplate?.content || ''}
              onChange={e => setEditingTemplate(prev => prev ? { ...prev, content: e.target.value } : null)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px]"
              placeholder="Enter email content"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Variables (comma-separated)</label>
            <input
              type="text"
              value={editingTemplate?.variables.join(', ') || ''}
              onChange={e => setEditingTemplate(prev => prev ? { ...prev, variables: e.target.value.split(',').map(v => v.trim()).filter(Boolean) } : null)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., username, amount, date"
            />
          </div>
        </div>
      </Modal>
    </main>
    </>
  );
}
