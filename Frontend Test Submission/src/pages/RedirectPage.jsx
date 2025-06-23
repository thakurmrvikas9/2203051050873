import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';

function RedirectPage() {
    const { shortcode } = useParams();
    const [target, setTarget] = useState(null);

    useEffect(() => {
        fetch(`/api/resolve/${shortcode}`)
            .then(res => res.json())
            .then(data => setTarget(data.longUrl))
            .catch(() => setTarget('/error'));
    }, [shortcode]);

    return target ? <Navigate to={target} /> : <p>Redirecting...</p>;
}

export default RedirectPage;
