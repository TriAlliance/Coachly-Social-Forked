import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface SystemSettings {
  allowSignups: boolean;
  requireEmailVerification: boolean;
  maxUploadSize: number;
  allowedFileTypes: string[];
  rateLimits: {
    scraping: {
      requestsPerMinute: number;
      requestsPerHour: number;
      cooldownPeriod: number;
    };
    api: {
      requestsPerMinute: number;
      requestsPerHour: number;
      cooldownPeriod: number;
    };
  };
}

export function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsRef = doc(db, 'system', 'settings');
      const rateLimitsRef = doc(db, 'system', 'rateLimits');

      const [settingsSnap, rateLimitsSnap] = await Promise.all([
        getDoc(settingsRef),
        getDoc(rateLimitsRef)
      ]);

      if (settingsSnap.exists() && rateLimitsSnap.exists()) {
        setSettings({
          ...settingsSnap.data(),
          rateLimits: rateLimitsSnap.data()
        } as SystemSettings);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    setSaving(true);
    setError(null);

    try {
      const settingsRef = doc(db, 'system', 'settings');
      const rateLimitsRef = doc(db, 'system', 'rateLimits');

      const { rateLimits, ...systemSettings } = settings;

      await Promise.all([
        updateDoc(settingsRef, systemSettings),
        updateDoc(rateLimitsRef, rateLimits)
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-500" />
          <h2 className="text-lg font-semibold">System Settings</h2>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">General Settings</h3>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allowSignups"
                checked={settings.allowSignups}
                onChange={(e) => setSettings({
                  ...settings,
                  allowSignups: e.target.checked
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="allowSignups">Allow New Signups</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="requireEmailVerification"
                checked={settings.requireEmailVerification}
                onChange={(e) => setSettings({
                  ...settings,
                  requireEmailVerification: e.target.checked
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="requireEmailVerification">Require Email Verification</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Upload Size (bytes)
              </label>
              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => setSettings({
                  ...settings,
                  maxUploadSize: parseInt(e.target.value)
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Rate Limits</h3>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Scraping</h4>
              <div className="space-y-2">
                <input
                  type="number"
                  value={settings.rateLimits.scraping.requestsPerMinute}
                  onChange={(e) => setSettings({
                    ...settings,
                    rateLimits: {
                      ...settings.rateLimits,
                      scraping: {
                        ...settings.rateLimits.scraping,
                        requestsPerMinute: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Requests per minute"
                />
                <input
                  type="number"
                  value={settings.rateLimits.scraping.requestsPerHour}
                  onChange={(e) => setSettings({
                    ...settings,
                    rateLimits: {
                      ...settings.rateLimits,
                      scraping: {
                        ...settings.rateLimits.scraping,
                        requestsPerHour: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Requests per hour"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">API</h4>
              <div className="space-y-2">
                <input
                  type="number"
                  value={settings.rateLimits.api.requestsPerMinute}
                  onChange={(e) => setSettings({
                    ...settings,
                    rateLimits: {
                      ...settings.rateLimits,
                      api: {
                        ...settings.rateLimits.api,
                        requestsPerMinute: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Requests per minute"
                />
                <input
                  type="number"
                  value={settings.rateLimits.api.requestsPerHour}
                  onChange={(e) => setSettings({
                    ...settings,
                    rateLimits: {
                      ...settings.rateLimits,
                      api: {
                        ...settings.rateLimits.api,
                        requestsPerHour: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Requests per hour"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Allowed File Types</h3>
          <div className="flex flex-wrap gap-2">
            {settings.allowedFileTypes.map((type, index) => (
              <div
                key={index}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
              >
                <span>{type}</span>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    allowedFileTypes: settings.allowedFileTypes.filter((_, i) => i !== index)
                  })}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const type = prompt('Enter MIME type (e.g., image/jpeg)');
                if (type && !settings.allowedFileTypes.includes(type)) {
                  setSettings({
                    ...settings,
                    allowedFileTypes: [...settings.allowedFileTypes, type]
                  });
                }
              }}
              className="px-3 py-1 border-2 border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-gray-400"
            >
              Add Type
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}