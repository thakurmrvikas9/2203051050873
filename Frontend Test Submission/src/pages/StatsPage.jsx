import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { log } from "../middleware/logger";

const getStoredUrls = () => {
  const raw = localStorage.getItem("shortenedUrls");
  return raw ? JSON.parse(raw) : [];
};

const StatsPage = () => {
  const [shortened, setShortened] = useState([]);

  useEffect(() => {
    const urls = getStoredUrls();
    setShortened(urls);

    log("frontend", "info", "stats", "Viewed statistics page");
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        URL Statistics
      </Typography>

      {shortened.length === 0 ? (
        <Typography>No URLs have been shortened yet.</Typography>
      ) : (
        shortened.map((entry, index) => (
          <Card key={index} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">
                {window.location.origin}/{entry.shortUrl}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Original URL: {entry.originalUrl}
              </Typography>
              <Typography>
                Created: {new Date(entry.createdAt).toLocaleString()}
              </Typography>
              <Typography>
                Expires: {new Date(entry.expireAt).toLocaleString()}
              </Typography>
              <Typography>Total Clicks: {entry.visits || 0}</Typography>

              <Divider sx={{ my: 1 }} />

              {entry.clicks && entry.clicks.length > 0 ? (
                <>
                  <Typography variant="subtitle1">Click History:</Typography>
                  <List dense>
                    {entry.clicks.map((click, i) => (
                      <ListItem key={i} divider>
                        <ListItemText
                          primary={`Clicked at ${new Date(click.time).toLocaleString()}`}
                          secondary={`Referrer: ${click.referrer}, Location: ${click.geo?.location || 'N/A'}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              ) : (
                <Typography color="textSecondary">
                  No click data yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default StatsPage;
