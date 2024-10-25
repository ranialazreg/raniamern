import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdherentManagement from './components/AdherentManagement';
import Home from './components/Home'; // Dashboard component
import ProduitManagement from './components/ProduitManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adherents" element={<AdherentManagement />} />
        <Route path="/produits" element={<ProduitManagement />} />

      </Routes>
    </Router>
  );
}

export default App;
