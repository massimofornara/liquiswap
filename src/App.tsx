import React, { useState } from 'react';
import Header from './components/Header';
import OnRamp from './components/OnRamp';
import OffRamp from './components/OffRamp';
import Swap from './components/Swap';
import Stats from './components/Stats';
import Features from './components/Features';
import ReferenceTokens from './components/ReferenceTokens';
import { TabType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('on-ramp');

  return (
    <div className="min-h-screen bg-[#0f0f1a] relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {/* Stats */}
          <Stats />

          {/* Main Widget */}
          <div className="max-w-xl mx-auto">
            <div className="glass-card p-6 md:p-8">
              {activeTab === 'on-ramp' && <OnRamp />}
              {activeTab === 'off-ramp' && <OffRamp />}
              {activeTab === 'swap' && <Swap />}
            </div>
          </div>

          {/* Reference Tokens Table */}
          <div className="max-w-5xl mx-auto">
            <ReferenceTokens />
          </div>

          {/* Features */}
          <div className="max-w-5xl mx-auto mt-12">
            <Features />
          </div>

          {/* Footer */}
          <footer className="mt-16 pb-8 text-center">
            <div className="glass-card p-6 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                    L
                  </div>
                  <span className="text-sm font-bold text-white">LiquiSwap</span>
                </div>
                <div className="flex items-center gap-6 text-xs text-slate-400">
                  <a href="#" className="hover:text-white transition-colors">Docs</a>
                  <a href="#" className="hover:text-white transition-colors">API</a>
                  <a href="#" className="hover:text-white transition-colors">Pricing</a>
                  <a href="#" className="hover:text-white transition-colors">Compliance</a>
                  <a href="#" className="hover:text-white transition-colors">Support</a>
                </div>
                <div className="flex items-center gap-3">
                  <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                    <i className="fab fa-twitter text-sm"></i>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                    <i className="fab fa-discord text-sm"></i>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                    <i className="fab fa-github text-sm"></i>
                  </a>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-500">
                  © 2026 LiquiSwap. Licensed fiat on/off-ramp provider. Regulated in EU, UK, and US.
                  <br />
                  <span className="text-slate-600">Swap any token — even illiquid ones. Prices set by creators in top market-cap crypto with fiat on/off-ramp on any bank account.</span>
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
