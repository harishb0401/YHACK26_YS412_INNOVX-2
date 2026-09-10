import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { LanguageProvider } from './i18n';
import {
  mockCollectors,
  mockRecyclers,
  mockWasteLots,
  mockTransactions,
  mockCollector,
  mockRecycler,
  mockAdmin
} from './data/mockData';

export default function App() {
  const navigate = useNavigate();

  // Active User / Auth State
  const [currentUser, setCurrentUser] = useState(null);

  // Platform Data
  const [materialLots, setMaterialLots] = useState(mockWasteLots);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [collectors, setCollectors] = useState(mockCollectors);
  const [recyclers, setRecyclers] = useState(mockRecyclers);

  // Auth Handlers
  const handleLoginSuccess = (userPayload) => {
    setCurrentUser(userPayload);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  // Workflow Action Handlers
  const handleLotCreated = (newLotData) => {
    const newLot = {
      id: `EW-2026-${String(Math.floor(100000 + Math.random() * 900000)).slice(0, 6)}`,
      category: newLotData.category,
      material: newLotData.material,
      quantity: newLotData.quantity,
      totalWeightKg: newLotData.quantity,
      unit: newLotData.unit || 'kg',
      condition: newLotData.condition,
      location: newLotData.location,
      createdDate: newLotData.collectionDate || new Date().toISOString().split('T')[0],
      benchmarkPrice: newLotData.benchmarkPrice || 350,
      estimatedLotValue: Math.round(newLotData.quantity * (newLotData.benchmarkPrice || 350)),
      status: 'REGISTERED',
      qrPayload: `EPR-QR-${Math.floor(100000 + Math.random() * 900000)}`,
      collectorId: currentUser?.id || "COL-TN-101",
      collectorName: currentUser?.name || "Ramesh Kumar"
    };

    setMaterialLots([newLot, ...materialLots]);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#F8F5EA] text-[#203128] font-sans antialiased selection:bg-[#3F7655]/20 selection:text-[#203128]">
        <AppRoutes
          currentUser={currentUser}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          materialLots={materialLots}
          onLotCreated={handleLotCreated}
          transactions={transactions}
          collectors={collectors}
          recyclers={recyclers}
        />
      </div>
    </LanguageProvider>
  );
}
