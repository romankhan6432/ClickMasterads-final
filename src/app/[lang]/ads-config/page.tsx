'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  SettingOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  ReloadOutlined,
  EditOutlined,
} from '@ant-design/icons';

import { useDispatch } from 'react-redux';

interface ZoneConfig {
  id: string;
  zone_id: string;
  name: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export default function AdsConfigPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [newZone, setNewZone] = useState({
    zone_id: '',
    name: '',
  });

  // Mock data - replace with actual data from Redux store
  const [zoneConfigs, setZoneConfigs] = useState<ZoneConfig[]>([
    {
      id: '1',
      zone_id: 'zone_123456',
      name: 'Homepage Banner',
      status: 'active',
      created_at: '2025-04-05T18:30:00',
    },
    {
      id: '2',
      zone_id: 'zone_789012',
      name: 'Sidebar Ad',
      status: 'active',
      created_at: '2025-04-05T17:45:00',
    },
  ]);

  const handleRefresh = () => {
    setLoading(true);
    // Implement your refresh logic here
    setTimeout(() => setLoading(false), 1000);
  };

  const handleAddNewZone = () => {
    if (!newZone.zone_id || !newZone.name) return;

    const newConfig: ZoneConfig = {
      id: Date.now().toString(),
      zone_id: newZone.zone_id,
      name: newZone.name,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    setZoneConfigs([...zoneConfigs, newConfig]);
    setNewZone({ zone_id: '', name: '' });
  };

  const handleDeleteZone = (id: string) => {
    setZoneConfigs(zoneConfigs.filter(zone => zone.id !== id));
  };

  const handleUpdateZone = (id: string, updates: Partial<ZoneConfig>) => {
    setZoneConfigs(zoneConfigs.map(zone => 
      zone.id === id ? { ...zone, ...updates } : zone
    ));
    setEditMode(null);
  };

  const handleToggleStatus = (id: string) => {
    setZoneConfigs(zoneConfigs.map(zone => 
      zone.id === id ? 
        { ...zone, status: zone.status === 'active' ? 'inactive' : 'active' } 
        : zone
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-8">
      <div className=" ml-[6%] mx-auto">
        <div className="flex justify-between items-center mb-8 bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center">
            <SettingOutlined className="mr-3 text-blue-400" />
            Ads Configuration
          </h1>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}`}
          >
            <ReloadOutlined className={`${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Add New Zone Form */}
        <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Add New Zone</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Zone ID"
              value={newZone.zone_id}
              onChange={(e) => setNewZone({ ...newZone, zone_id: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Zone Name"
              value={newZone.name}
              onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddNewZone}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-2 transition-all duration-300"
            >
              <PlusOutlined />
              Add Zone
            </button>
          </div>
        </div>

        {/* Zone List */}
        <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">Zone Configurations</h2>
          <div className="space-y-4">
            {zoneConfigs.map((zone) => (
              <div
                key={zone.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-800 hover:bg-gray-800 transition-all duration-300"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {editMode === zone.id ? (
                    <>
                      <input
                        type="text"
                        value={zone.zone_id}
                        onChange={(e) => handleUpdateZone(zone.id, { zone_id: e.target.value })}
                        className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-gray-100"
                      />
                      <input
                        type="text"
                        value={zone.name}
                        onChange={(e) => handleUpdateZone(zone.id, { name: e.target.value })}
                        className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-gray-100"
                      />
                    </>
                  ) : (
                    <>
                      <div className="text-gray-300">
                        <span className="text-gray-500">ID:</span> {zone.zone_id}
                      </div>
                      <div className="text-gray-300">
                        <span className="text-gray-500">Name:</span> {zone.name}
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(zone.id)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        zone.status === 'active'
                          ? 'bg-green-900/20 text-green-400'
                          : 'bg-red-900/20 text-red-400'
                      }`}
                    >
                      {zone.status}
                    </button>
                    <span className="text-gray-500 text-sm">
                      {new Date(zone.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setEditMode(editMode === zone.id ? null : zone.id)}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors duration-300"
                  >
                    <EditOutlined />
                  </button>
                  <button
                    onClick={() => handleDeleteZone(zone.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors duration-300"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
            ))}
            {zoneConfigs.length === 0 && (
              <div className="flex items-center justify-center p-8 text-gray-500">
                No zones configured
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
