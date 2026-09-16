import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import OnRamp from './components/OnRamp';
import OffRamp from './components/OffRamp';
import Swap from './components/Swap';
import Dashboard from './components/Dashboard';
import { TabType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('swap');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex">
      {/* Noise overlay */}
      <div className="noise-overlay"></div>

      {/* Grid pattern background */}
      <div className="fixed inset-0 grid-pattern pointer-events-none"></div>

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => { setActiveTab(tab); setSidebarOpen(false); }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px]">
        {/* Top Bar */}
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 px-4 md:px-8 py-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'on-ramp' && <OnRamp />}
            {activeTab === 'off-ramp' && <OffRamp />}
            {activeTab === 'swap' && <Swap />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
