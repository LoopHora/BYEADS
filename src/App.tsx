import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DocsPage from './pages/DocsPage';
import InstallPage from './pages/InstallPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/install" element={<InstallPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/docs/:docId" element={<DocsPage />} />
      </Routes>
      <Footer />
    </>
  );
}
