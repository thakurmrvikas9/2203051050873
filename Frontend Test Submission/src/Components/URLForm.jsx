import React, { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import { isValidURL, isValidMinutes, isValidShortcode } from '../utils/validators';

function URLForm({ onSubmit }) {
    const [urls, setUrls] = useState([{ url: '', minutes: '', shortcode: '' }]);

    const handleChange = (index, field, value) => {
        const updated = [...urls];
        updated[index][field] = value;
        setUrls(updated);
    };

    const handleAdd = () => {
        if (urls.length < 5) {
            setUrls([...urls, { url: '', minutes: '', shortcode: '' }]);
        }
    };

    const validateAndSubmit = () => {
        try {
            const payload = urls.filter(u => u.url.trim()).map(u => {
                if (!isValidURL(u.url)) throw new Error('Invalid URL');
                if (u.minutes && !isValidMinutes(u.minutes)) throw new Error('Invalid minutes');
                if (u.shortcode && !isValidShortcode(u.shortcode)) throw new Error('Invalid shortcode');
                return {
                    longUrl: u.url,
                    validityMinutes: u.minutes ? parseInt(u.minutes) : 30,
                    shortcode: u.shortcode || undefined
                };
            });

            onSubmit(payload);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <Grid container spacing={2}>
            {urls.map((row, idx) => (
                <Grid item xs={12} key={idx}>
                    <TextField label="Long URL" fullWidth margin="dense"
                        value={row.url} onChange={(e) => handleChange(idx, 'url', e.target.value)} />
                    <TextField label="Validity (mins)" fullWidth margin="dense"
                        value={row.minutes} onChange={(e) => handleChange(idx, 'minutes', e.target.value)} />
                    <TextField label="Custom Shortcode" fullWidth margin="dense"
                        value={row.shortcode} onChange={(e) => handleChange(idx, 'shortcode', e.target.value)} />
                </Grid>
            ))}
            <Grid item xs={12}>
                <Button onClick={handleAdd} disabled={urls.length >= 5}>+ Add URL</Button>
                <Button variant="contained" onClick={validateAndSubmit}>Shorten</Button>
            </Grid>
        </Grid>
    );
}

export default URLForm;
