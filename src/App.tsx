import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PwaAppHeader from './components/PwaAppHeader';
import PwaBottomNav from './components/PwaBottomNav';
import HomePage from './pages/HomePage';
import DocsPage from './pages/DocsPage';
import InstallPage from './pages/InstallPage';
import DashboardPage from './pages/DashboardPage';
import TestLabPage from './pages/TestLabPage';

export default function App() {
  return (
    <>
      <PwaAppHeader />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/install" element={<InstallPage />} />
        <Route path="/test" element={<TestLabPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/docs/:docId" element={<DocsPage />} />
      </Routes>
      <Footer />
      <PwaBottomNav />
    </>
  );
}
