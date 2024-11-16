import axios from 'axios';
import type { Post } from '../types';

interface GarminActivity {
  activityId: string;
  activityName: string;
  activityType: string;
  startTimeLocal: string;
  duration: number;
  distance?: number;
  elevationGain?: number;
  calories?: number;
  hasPolyline?: boolean;
  photoIds?: string[];
}

export class GarminService {
  private isConnected: boolean = false;
  private mockActivities: GarminActivity[] = [
    {
      activityId: '1',
      activityName: 'Morning Run',
      activityType: 'running',
      startTimeLocal: new Date().toISOString(),
      duration: 1800,
      distance: 5.2,
      elevationGain: 125,
      calories: 450,
      hasPolyline: true
    },
    {
      activityId: '2',
      activityName: 'Evening Cycle',
      activityType: 'cycling',
      startTimeLocal: new Date(Date.now() - 86400000).toISOString(),
      duration: 3600,
      distance: 20.5,
      elevationGain: 300,
      calories: 750,
      hasPolyline: true
    }
  ];

  async initialize(): Promise<boolean> {
    this.isConnected = true;
    return true;
  }

  async isAuthenticated(): Promise<boolean> {
    return this.isConnected;
  }

  async getLatestActivities(limit: number = 10): Promise<Post[]> {
    try {
      // In a real implementation, this would fetch from Garmin's API
      // Using mock data for demonstration
      return this.mockActivities.slice(0, limit).map(activity => ({
        id: activity.activityId,
        userId: 'garmin-user',
        username: 'Garmin User',
        activityType: this.mapGarminActivityType(activity.activityType),
        title: activity.activityName,
        description: '',
        date: activity.startTimeLocal,
        duration: activity.duration,
        distance: activity.distance,
        elevation: activity.elevationGain,
        calories: activity.calories,
        images: [],
        likes: 0,
        comments: [],
        mapUrl: activity.hasPolyline ? `/mock-map-${activity.activityId}.png` : undefined,
        user: {
          id: 'garmin-user',
          username: 'Garmin User',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=GarminUser`,
          followers: 0,
          following: 0,
          stats: {
            totalActivities: this.mockActivities.length,
            totalDistance: this.mockActivities.reduce((acc, curr) => acc + (curr.distance || 0), 0),
            totalDuration: this.mockActivities.reduce((acc, curr) => acc + curr.duration, 0)
          }
        }
      }));
    } catch (error) {
      console.error('Error fetching Garmin activities:', error);
      return [];
    }
  }

  private mapGarminActivityType(garminType: string): 'run' | 'cycle' | 'swim' | 'hike' | 'workout' {
    const typeMap: { [key: string]: 'run' | 'cycle' | 'swim' | 'hike' | 'workout' } = {
      'running': 'run',
      'cycling': 'cycle',
      'swimming': 'swim',
      'hiking': 'hike',
      'strength_training': 'workout'
    };
    return typeMap[garminType.toLowerCase()] || 'workout';
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
  }
}