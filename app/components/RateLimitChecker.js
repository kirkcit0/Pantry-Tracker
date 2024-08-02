import { useState } from 'react';
import axios from 'axios';
import { Button, Typography, Box } from '@mui/material';

const RateLimitChecker = () => {
  const [rateLimitData, setRateLimitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckRateLimit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/rate-limit');
      setRateLimitData(response.data);
    } catch (error) {
      console.error('Error fetching rate limit data:', error);
      setError('Failed to fetch rate limit data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button 
        variant="contained" 
        onClick={handleCheckRateLimit} 
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Check Rate Limit'}
      </Button>
      {error && (
        <Typography color="error" mt={2}>{error}</Typography>
      )}
      {rateLimitData && (
        <Box mt={2}>
          <Typography variant="h6">Rate Limit Info:</Typography>
          <Typography>Label: {rateLimitData.data.label}</Typography>
          <Typography>Usage: {rateLimitData.data.usage}</Typography>
          <Typography>Limit: {rateLimitData.data.limit !== null ? rateLimitData.data.limit : 'Unlimited'}</Typography>
          <Typography>Free Tier: {rateLimitData.data.is_free_tier ? 'Yes' : 'No'}</Typography>
          <Typography>Requests Allowed: {rateLimitData.data.rate_limit.requests}</Typography>
          <Typography>Interval: {rateLimitData.data.rate_limit.interval}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default RateLimitChecker;
