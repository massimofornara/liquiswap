import React from 'react';

const Stats: React.FC = () => {
  const stats = [
    { label: 'Total Volume', value: '$2.4B+', icon: '💰', change: '+12.5%' },
    { label: 'Transactions', value: '1.2M+', icon: '📊', change: '+8.3%' },
    { label: 'Supported Tokens', value: '15,000+', icon: '🪙', change: '+340' },
    { label: 'Avg. Settlement', value: '< 30s', icon: '⚡', change: '-5s' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="glass-card p-4 hover:border-indigo-500/30 transition-all"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{stat.icon}</span>
            <span className="text-xs text-slate-500">{stat.label}</span>
          </div>
          <div className="text-xl font-bold text-white">{stat.value}</div>
          <div className="text-xs text-green-400 mt-1">{stat.change}</div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
