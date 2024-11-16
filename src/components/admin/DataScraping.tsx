import React, { useState } from 'react';
import { Database, Play, Pause, RefreshCw, AlertCircle } from 'lucide-react';
import { ScraperService } from '../../services/scraper.service';

const scraperService = new ScraperService();

interface ScrapingJob {
  id: string;
  source: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  total: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export function DataScraping() {
  const [jobs, setJobs] = useState<ScrapingJob[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sources = [
    { id: 'eventbrite', name: 'Eventbrite' },
    { id: 'facebook', name: 'Facebook Events' },
    { id: 'meetup', name: 'Meetup' },
    { id: 'strava', name: 'Strava Clubs' }
  ];

  const startScraping = async () => {
    if (selectedSources.length === 0) {
      setError('Please select at least one source');
      return;
    }

    setError(null);
    setIsRunning(true);

    try {
      const jobId = await scraperService.createScraperJob(selectedSources);
      // Start polling for updates
      pollJobStatus(jobId);
    } catch (err: any) {
      setError(err.message);
      setIsRunning(false);
    }
  };

  const pollJobStatus = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const status = await scraperService.getJobStatus(jobId);
        setJobs(prev => {
          const existing = prev.find(j => j.id === jobId);
          if (!existing) {
            return [...prev, status];
          }
          return prev.map(j => j.id === jobId ? status : j);
        });

        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval);
          setIsRunning(false);
        }
      } catch (err) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 2000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-blue-500" />
          <h2 className="text-lg font-semibold">Data Scraping</h2>
        </div>
        <button
          onClick={startScraping}
          disabled={isRunning || selectedSources.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start Scraping
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {sources.map((source) => (
          <button
            key={source.id}
            onClick={() => {
              setSelectedSources(prev => 
                prev.includes(source.id)
                  ? prev.filter(id => id !== source.id)
                  : [...prev, source.id]
              );
            }}
            disabled={isRunning}
            className={`p-4 rounded-lg border-2 transition-colors ${
              selectedSources.includes(source.id)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {source.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">{job.source}</h3>
                <p className="text-sm text-gray-500">
                  Started: {new Date(job.startedAt).toLocaleString()}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                job.status === 'completed' ? 'bg-green-100 text-green-800' :
                job.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round((job.progress / job.total) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(job.progress / job.total) * 100}%` }}
                />
              </div>
            </div>

            {job.error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {job.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}