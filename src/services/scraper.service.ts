import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { ScraperJob, ScraperTask, JobStatus } from '../types/scraper';

export class ScraperService {
  async createScraperJob(sources: string[]): Promise<string> {
    try {
      // Create job document
      const jobRef = await addDoc(collection(db, 'scraper_jobs'), {
        sources,
        status: 'pending',
        progress: 0,
        total: sources.length,
        startedAt: serverTimestamp(),
        completedAt: null,
        error: null
      });

      // Create individual tasks for each source
      const tasks = sources.map(source => 
        addDoc(collection(db, 'scraper_tasks'), {
          jobId: jobRef.id,
          source,
          status: 'pending',
          startedAt: serverTimestamp(),
          completedAt: null,
          result: null,
          error: null
        })
      );

      await Promise.all(tasks);
      return jobRef.id;
    } catch (error) {
      console.error('Error creating scraper job:', error);
      throw error;
    }
  }

  async getJobStatus(jobId: string): Promise<ScraperJob> {
    try {
      // Get job document
      const jobRef = doc(db, 'scraper_jobs', jobId);
      const jobDoc = await getDoc(jobRef);

      if (!jobDoc.exists()) {
        throw new Error('Job not found');
      }

      // Get all tasks for this job
      const tasksRef = collection(db, 'scraper_tasks');
      const q = query(tasksRef, where('jobId', '==', jobId));
      const taskDocs = await getDocs(q);

      const tasks = taskDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ScraperTask[];

      const completedTasks = tasks.filter(task => task.status === 'completed');

      return {
        id: jobId,
        ...jobDoc.data(),
        tasks,
        progress: completedTasks.length,
        total: tasks.length
      } as ScraperJob;
    } catch (error) {
      console.error('Error getting job status:', error);
      throw error;
    }
  }

  async updateJobProgress(jobId: string, progress: number, status: JobStatus): Promise<void> {
    try {
      const jobRef = doc(db, 'scraper_jobs', jobId);
      await updateDoc(jobRef, {
        progress,
        status,
        completedAt: status === 'completed' ? serverTimestamp() : null
      });
    } catch (error) {
      console.error('Error updating job progress:', error);
      throw error;
    }
  }

  async updateTaskStatus(taskId: string, status: JobStatus, result?: any, error?: string): Promise<void> {
    try {
      const taskRef = doc(db, 'scraper_tasks', taskId);
      await updateDoc(taskRef, {
        status,
        completedAt: serverTimestamp(),
        result,
        error
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }
}