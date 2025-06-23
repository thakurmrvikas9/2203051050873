// src/pages/ShortenPage.jsx

import { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import URLInputGroup from '../components/URLInputGroup';
import { generateShortcode } from '../utils/generateShortcode';
import { isValidShortcode, isValidURL } from '../utils/validators';
import { log } from '../middleware/logger';

const ShortenPage = () => {
  const [inputs, setInputs] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [shortened, setShortened] = useState([]);

  const handleChange = (index, newData) => {
    const updated = [...inputs];
    updated[index] = newData;
    setInputs(updated);
  };

  const handleAddInput = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: '', validity: '', shortcode: '' }]);
    }
  };

  const handleShorten = async () => {
    const results = [];

    for (const entry of inputs) {
      const { url, validity, shortcode } = entry;

      if (!isValidURL(url)) {
        await log("frontend", "error", "shortener", `Invalid URL: ${url}`);
        continue;
      }

      let finalCode = shortcode || generateShortcode();

      if (!isValidShortcode(finalCode)) {
        await log("frontend", "error", "shortener", `Invalid shortcode: ${finalCode}`);
        continue;
      }

      if (shortened.find(item => item.shortUrl === finalCode)) {
        await log("frontend", "error", "shortener", `Shortcode collision: ${finalCode}`);
        continue;
      }

      const now = Date.now();
      const duration = validity ? parseInt(validity) : 30;
      const expireAt = now + duration * 60000;

      const shortEntry = {
        originalUrl: url,
        shortUrl: finalCode,
        createdAt: now,
        expireAt,
        visits: 0,
        clicks: []
      };

      await log("frontend", "info", "shortener", `Created short link: ${finalCode}`);
      results.push(shortEntry);
    }

    setShortened([...shortened, ...results]);
    setInputs([{ url: '', validity: '', shortcode: '' }]);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Shorten Your URLs</Typography>

      {inputs.map((input, idx) => (
        <URLInputGroup
          key={idx}
          index={idx}
          data={input}
          onChange={handleChange}
        />
      ))}

      <Button variant="contained" onClick={handleAddInput} disabled={inputs.length >= 5}>
        Add Another URL
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={handleShorten}
        sx={{ ml: 2 }}
      >
        Shorten All
      </Button>

      {shortened.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Shortened URLs</Typography>
          {shortened.map((item, idx) => (
            <Paper key={idx} sx={{ p: 2, mt: 2 }}>
              <Typography><strong>Original:</strong> {item.originalUrl}</Typography>
              <Typography>
                <strong>Short:</strong> <a href={`/${item.shortUrl}`}>{window.location.origin}/{item.shortUrl}</a>
              </Typography>
              <Typography><strong>Expires:</strong> {new Date(item.expireAt).toLocaleString()}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ShortenPage;
