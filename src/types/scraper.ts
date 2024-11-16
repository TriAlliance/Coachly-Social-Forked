export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ScraperJob {
  id: string;
  sources: string[];
  status: JobStatus;
  progress: number;
  total: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
  tasks: ScraperTask[];
}

export interface ScraperTask {
  id: string;
  jobId: string;
  source: string;
  status: JobStatus;
  startedAt: string;
  completedAt?: string;
  result?: any;
  error?: string;
}

export interface ScrapedEvent {
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  type: string;
  organizer: string;
  url: string;
  price?: number;
  capacity?: number;
  tags?: string[];
  imageUrl?: string;
}

export interface ScrapedGroup {
  name: string;
  description: string;
  type: string;
  privacy: 'public' | 'private';
  location?: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  memberCount: number;
  imageUrl?: string;
  tags?: string[];
  url: string;
}