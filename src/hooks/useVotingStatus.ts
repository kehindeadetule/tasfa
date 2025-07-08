import { useState, useEffect } from 'react';

interface VotingStatus {
  votedCategories: string[];
  canVote: boolean;
}

export const useVotingStatus = () => {
  const [votingStatus, setVotingStatus] = useState<VotingStatus>({
    votedCategories: [],
    canVote: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVotingStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://172.20.10.2:3001/api/votes/voting-status');
      const data = await response.json();
      
      if (data.success) {
        setVotingStatus(data.data);
      } else {
        setError('Failed to fetch voting status');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const canVoteForCategory = (category: string): boolean => {
    return !votingStatus.votedCategories.includes(category);
  };

  const updateVotingStatus = (category: string) => {
    setVotingStatus(prev => ({
      ...prev,
      votedCategories: [...prev.votedCategories, category]
    }));
  };

  useEffect(() => {
    fetchVotingStatus();
  }, []);

  return {
    votingStatus,
    loading,
    error,
    canVoteForCategory,
    updateVotingStatus,
    refetch: fetchVotingStatus
  };
}; 