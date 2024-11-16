import React, { useState, useEffect } from 'react';
import { Globe, Key, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { collection, query, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  permissions: string[];
  status: 'active' | 'revoked';
}

export function ApiManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const permissions = [
    'events:read',
    'events:write',
    'groups:read',
    'groups:write',
    'users:read',
    'analytics:read'
  ];

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const keysRef = collection(db, 'api_keys');
      const querySnapshot = await getDocs(query(keysRef));
      const keyData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ApiKey[];
      setApiKeys(keyData);
    } catch (error) {
      console.error('Error loading API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 32;
    let key = '';
    for (let i = 0; i < length; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const createApiKey = async () => {
    if (!newKeyName || selectedPermissions.length === 0) return;

    try {
      const newKey = {
        name: newKeyName,
        key: generateApiKey(),
        createdAt: serverTimestamp(),
        permissions: selectedPermissions,
        status: 'active'
      };

      await addDoc(collection(db, 'api_keys'), newKey);
      setShowCreateModal(false);
      setNewKeyName('');
      setSelectedPermissions([]);
      loadApiKeys();
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const revokeApiKey = async (keyId: string) => {
    try {
      await deleteDoc(doc(db, 'api_keys', keyId));
      loadApiKeys();
    } catch (error) {
      console.error('Error revoking API key:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-blue-500" />
          <h2 className="text-lg font-semibold">API Management</h2>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" />
          Create API Key
        </button>
      </div>

      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <div
            key={apiKey.id}
            className="p-4 bg-white rounded-lg border"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium">{apiKey.name}</h3>
                <p className="text-sm text-gray-500">
                  Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => revokeApiKey(apiKey.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Key className="w-4 h-4 text-gray-400" />
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {apiKey.key}
              </code>
            </div>

            <div className="flex flex-wrap gap-2">
              {apiKey.permissions.map((permission) => (
                <span
                  key={permission}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Create API Key</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter key name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permissions
                </label>
                <div className="space-y-2">
                  {permissions.map((permission) => (
                    <label key={permission} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPermissions([...selectedPermissions, permission]);
                          } else {
                            setSelectedPermissions(
                              selectedPermissions.filter(p => p !== permission)
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {permission}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={createApiKey}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}