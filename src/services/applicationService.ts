import api from './api';
import type { Interview } from '../types/interview';

// Re-export Interview for backward compatibility
export type { Interview };

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  cvId: string;
  status: string;
  appliedAt: string;
  coverLetter?: string;
  interview?: Interview;
  job?: {
    id: string;
    title: string;
    company: {
      companyName: string;
    };
  };
  cv?: {
    id: string;
    fileName: string;
  };
}

export interface CreateApplicationRequest {
  jobId: string;
  cvId?: string;
  coverLetter?: string;
}

export const applicationService = {
  /**
   * Submit a job application
   */
  async createApplication(data: CreateApplicationRequest): Promise<Application> {
    const response = await api.post('/applications', data);
    return response.data;
  },

  /**
   * Check if user has already applied to a job
   */
  async checkApplication(jobId: string): Promise<{ hasApplied: boolean }> {
    const response = await api.get(`/applications/check/${jobId}`);
    return response.data;
  },

  /**
   * Get user's application for a specific job
   */
  async getApplicationByJob(jobId: string): Promise<Application> {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  /**
   * Get all user's applications
   */
  async getMyApplications(): Promise<Application[]> {
    const response = await api.get('/applications');
    return response.data;
  },

  /**
   * Accept application and schedule interview
   */
  async acceptApplication(
    applicationId: string,
    data: {
      interviewDate: string;
      interviewTime: string;
      location?: string;
      notes?: string;
    }
  ): Promise<{ message: string; application: Application; interview: Interview }> {
    const response = await api.post(`/applications/${applicationId}/accept`, data);
    return response.data;
  },
};
