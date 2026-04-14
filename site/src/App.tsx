import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EvidenceProvider } from './components/EvidenceModal';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

function App() {
  return (
    <BrowserRouter>
      <EvidenceProvider>
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/privacidade" element={<PrivacyPage />} />
              <Route path="/termos" element={<TermsPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </EvidenceProvider>
    </BrowserRouter>
  );
}

export default App;
