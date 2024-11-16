import React, { useState } from 'react';
import { Heart, Lock, Eye, EyeOff, Scale, Ruler, Calendar, Activity, Plus, Edit2 } from 'lucide-react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

interface HealthData {
  height?: number;
  weight?: number;
  dateOfBirth?: string;
  bloodType?: string;
  allergies?: string[];
  medicalConditions?: string[];
  fitnessGoals?: string[];
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  preferredActivities?: string[];
  isPublic?: boolean;
}

const activityLevels = {
  sedentary: 'Sedentary (little or no exercise)',
  light: 'Light (exercise 1-3 times/week)',
  moderate: 'Moderate (exercise 3-5 times/week)',
  active: 'Active (exercise 6-7 times/week)',
  very_active: 'Very Active (exercise multiple times/day)'
};

export function HealthDetails() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState<HealthData>({
    isPublic: false
  });

  // Load health data
  React.useEffect(() => {
    if (user) {
      const loadHealthData = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().healthData) {
          setHealthData(docSnap.data().healthData);
        }
      };
      loadHealthData();
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        healthData: healthData
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePrivacy = async () => {
    setHealthData(prev => ({
      ...prev,
      isPublic: !prev.isPublic
    }));
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          <h2 className="text-lg font-semibold">Health & Fitness Profile</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePrivacy}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {healthData.isPublic ? (
              <>
                <Eye className="w-4 h-4" />
                <span>Public</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Private</span>
              </>
            )}
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Measurements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={healthData.height || ''}
                onChange={(e) => setHealthData(prev => ({ ...prev, height: Number(e.target.value) }))}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Enter height"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <div className="relative">
              <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={healthData.weight || ''}
                onChange={(e) => setHealthData(prev => ({ ...prev, weight: Number(e.target.value) }))}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Enter weight"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={healthData.dateOfBirth || ''}
                onChange={(e) => setHealthData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
            <select
              value={healthData.bloodType || ''}
              onChange={(e) => setHealthData(prev => ({ ...prev, bloodType: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            >
              <option value="">Select blood type</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
            <div className="flex flex-wrap gap-2">
              {healthData.allergies?.map((allergy, index) => (
                <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {allergy}
                  {isEditing && (
                    <button
                      onClick={() => setHealthData(prev => ({
                        ...prev,
                        allergies: prev.allergies?.filter((_, i) => i !== index)
                      }))}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <button
                  onClick={() => {
                    const allergy = prompt('Enter allergy');
                    if (allergy) {
                      setHealthData(prev => ({
                        ...prev,
                        allergies: [...(prev.allergies || []), allergy]
                      }));
                    }
                  }}
                  className="px-2 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-gray-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
            <div className="flex flex-wrap gap-2">
              {healthData.medicalConditions?.map((condition, index) => (
                <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {condition}
                  {isEditing && (
                    <button
                      onClick={() => setHealthData(prev => ({
                        ...prev,
                        medicalConditions: prev.medicalConditions?.filter((_, i) => i !== index)
                      }))}
                      className="ml-2 text-yellow-600 hover:text-yellow-800"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <button
                  onClick={() => {
                    const condition = prompt('Enter medical condition');
                    if (condition) {
                      setHealthData(prev => ({
                        ...prev,
                        medicalConditions: [...(prev.medicalConditions || []), condition]
                      }));
                    }
                  }}
                  className="px-2 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-gray-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Fitness Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
            <select
              value={healthData.activityLevel || ''}
              onChange={(e) => setHealthData(prev => ({ 
                ...prev, 
                activityLevel: e.target.value as HealthData['activityLevel']
              }))}
              disabled={!isEditing}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            >
              <option value="">Select activity level</option>
              {Object.entries(activityLevels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goals</label>
            <div className="flex flex-wrap gap-2">
              {healthData.fitnessGoals?.map((goal, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {goal}
                  {isEditing && (
                    <button
                      onClick={() => setHealthData(prev => ({
                        ...prev,
                        fitnessGoals: prev.fitnessGoals?.filter((_, i) => i !== index)
                      }))}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <button
                  onClick={() => {
                    const goal = prompt('Enter fitness goal');
                    if (goal) {
                      setHealthData(prev => ({
                        ...prev,
                        fitnessGoals: [...(prev.fitnessGoals || []), goal]
                      }));
                    }
                  }}
                  className="px-2 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-gray-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Activities</label>
            <div className="flex flex-wrap gap-2">
              {healthData.preferredActivities?.map((activity, index) => (
                <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {activity}
                  {isEditing && (
                    <button
                      onClick={() => setHealthData(prev => ({
                        ...prev,
                        preferredActivities: prev.preferredActivities?.filter((_, i) => i !== index)
                      }))}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <button
                  onClick={() => {
                    const activity = prompt('Enter preferred activity');
                    if (activity) {
                      setHealthData(prev => ({
                        ...prev,
                        preferredActivities: [...(prev.preferredActivities || []), activity]
                      }));
                    }
                  }}
                  className="px-2 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-gray-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}