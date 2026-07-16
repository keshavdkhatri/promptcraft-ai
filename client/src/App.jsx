import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import CreatePrompt from './pages/CreatePrompt';
import PromptLibrary from './pages/PromptLibrary';
import './styles/global.css';

function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => setToast(null);

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/create" replace />} />
            <Route path="/create" element={<CreatePrompt showToast={showToast} />} />
            <Route path="/library" element={<PromptLibrary showToast={showToast} />} />
          </Routes>
        </main>

        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={closeToast} 
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
