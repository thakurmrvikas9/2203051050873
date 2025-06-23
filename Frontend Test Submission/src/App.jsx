import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShortenerPage from './pages/ShortenerPage';
import RedirectPage from './pages/RedirectPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShortenerPage />} />
        <Route path="/:shortcode" element={<RedirectPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
