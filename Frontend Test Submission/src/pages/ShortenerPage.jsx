import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import URLForm from '../components/URLForm';
import URLResult from '../components/URLResult';
import { logEvent } from '../utils/logger';

function ShortenerPage() {
  const [results, setResults] = useState([]);

  const handleSubmit = async (urls) => {
    logEvent('Submitting URLs', urls);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(urls)
      });
      const data = await res.json();
      setResults(data);
      logEvent('Shortened URLs received', data);
    } catch (error) {
      logEvent('Shortening failed', error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4">URL Shortener</Typography>
      <URLForm onSubmit={handleSubmit} />
      <URLResult data={results} />
    </Box>
  );
}

export default ShortenerPage;
