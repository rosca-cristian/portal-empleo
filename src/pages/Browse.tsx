import { useState, useEffect } from 'react';
import api from '../services/api';
import JobCard from '../components/jobs/JobCard';
import './Browse.css';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  createdAt: string;
  company: {
    id: string;
    companyName: string;
  };
}

export default function Browse() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (searchQuery = '') => {
    try {
      setLoading(true);
      const params = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
      const response = await api.get(`/jobs${params}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(search);
  };

  if (loading) {
    return (
      <div className="browse-container">
        <div className="browse-loading">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="browse-container">
      <div className="browse-content">
        <h1 className="browse-title">Browse Jobs</h1>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search jobs by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {jobs.length === 0 ? (
          <div className="browse-empty">
            <p>No jobs posted yet. Check back soon!</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
