import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

function ApiStatusPage() {
  const [apiStatus, setApiStatus] = useState('Checking API status...');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    const checkApi = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiService.get('');
        setApiStatus(response);
      } catch (err) {
        setError(`Failed to connect to API: ${err.message}`);
        setApiStatus('API Connection Failed');
      }
      setIsLoading(false);
    };

    checkApi();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center', marginTop: '120px' }}>
      <h1>API Status</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <p style={{ color: 'green' }}>{apiStatus}</p>
      )}
    </div>
  );
}

export default ApiStatusPage;
