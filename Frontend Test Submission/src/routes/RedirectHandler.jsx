import { useParams, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { log } from '../middleware/logger';

const getStoredUrls = () => {
  const raw = localStorage.getItem("shortenedUrls");
  return raw ? JSON.parse(raw) : [];
};

const setStoredUrls = (data) => {
  localStorage.setItem("shortenedUrls", JSON.stringify(data));
};

const getGeoLocation = () => {
  return { location: "IN" }; 
};

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urls = getStoredUrls();
    const match = urls.find((entry) => entry.shortUrl === shortcode);

    if (!match) {
      log("frontend", "error", "redirect", `Shortcode not found: ${shortcode}`);
      setError("Shortened link not found.");
      return;
    }

    const now = Date.now();
    if (now > match.expireAt) {
      log("frontend", "warning", "redirect", `Expired link clicked: ${shortcode}`);
      setError("This link has expired.");
      return;
    }

    const click = {
      time: now,
      referrer: document.referrer || "direct",
      geo: getGeoLocation()
    };

    match.clicks = match.clicks || [];
    match.visits = (match.visits || 0) + 1;
    match.clicks.push(click);

    const updatedUrls = urls.map((entry) =>
      entry.shortUrl === shortcode ? match : entry
    );
    setStoredUrls(updatedUrls);

    log("frontend", "info", "redirect", `Redirected to ${match.originalUrl} from ${shortcode}`);

    setRedirectUrl(match.originalUrl);
  }, [shortcode]);

  if (error) return <p style={{ padding: "2rem", color: "crimson" }}>{error}</p>;
  if (redirectUrl) return <Navigate to={redirectUrl} replace />;

  return <p style={{ padding: "2rem" }}>Redirecting...</p>;
};

export default RedirectHandler;
