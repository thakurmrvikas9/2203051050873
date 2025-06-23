// src/components/URLInputGroup.jsx

import { TextField, Grid } from '@mui/material';

const URLInputGroup = ({ index, data, onChange }) => {
  const handleInput = (e) => {
    const { name, value } = e.target;
    onChange(index, { ...data, [name]: value });
  };

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} md={5}>
        <TextField
          fullWidth
          label="Original URL"
          name="url"
          value={data.url}
          onChange={handleInput}
          required
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Validity (min)"
          name="validity"
          type="number"
          value={data.validity}
          onChange={handleInput}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Custom Shortcode"
          name="shortcode"
          value={data.shortcode}
          onChange={handleInput}
        />
      </Grid>
    </Grid>
  );
};

export default URLInputGroup;
