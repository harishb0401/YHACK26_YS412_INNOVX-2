import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

export default function CollectorLayout({ currentUser, onLogout, onOpenSearchModal }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EA] text-[#203128] antialiased font-sans">
      <Navbar 
        isLoggedIn={true} 
        currentRole="collector" 
        userProfile={currentUser}
        onLogout={onLogout}
        onOpenSearchModal={onOpenSearchModal}
      />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
