'use client';

interface SummaryData {
  totalSuspiciousIPs: number;
  totalParticipantsAffected: number;
  riskLevels: { high: number; medium: number; low: number };
  incognitoStats: { ipsWithIncognito: number; totalIncognitoVotes: number };
  deviceStats: { totalIPs: number; multiDeviceIPs: number };
  vercelStats: { ipsInVercelList: number };
}

interface SummaryCardsProps {
  data: SummaryData;
}

export function SummaryCards({ data }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Suspicious IPs',
      value: data.totalSuspiciousIPs,
      change: '+12%',
      changeType: 'increase',
      icon: '🌐',
      color: 'bg-red-500',
      description: 'IPs with suspicious activity'
    },
    {
      title: 'Affected Participants',
      value: data.totalParticipantsAffected,
      change: '+8%',
      changeType: 'increase',
      icon: '👥',
      color: 'bg-orange-500',
      description: 'Participants with suspicious votes'
    },
    {
      title: 'High Risk IPs',
      value: data.riskLevels.high,
      change: '+5%',
      changeType: 'increase',
      icon: '🚨',
      color: 'bg-red-600',
      description: 'IPs with high risk scores'
    },
    {
      title: 'Incognito Usage',
      value: data.incognitoStats.ipsWithIncognito,
      change: '+15%',
      changeType: 'increase',
      icon: '🕵️',
      color: 'bg-purple-500',
      description: 'IPs using incognito mode'
    },
    {
      title: 'Multi-Device IPs',
      value: data.deviceStats.multiDeviceIPs,
      change: '+10%',
      changeType: 'increase',
      icon: '📱',
      color: 'bg-blue-500',
      description: 'IPs using multiple devices'
    },
    {
      title: 'Vercel Matches',
      value: data.vercelStats.ipsInVercelList,
      change: 'New',
      changeType: 'neutral',
      icon: '📊',
      color: 'bg-green-500',
      description: 'IPs found in Vercel data'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
            <div className={`${card.color} rounded-full p-3`}>
              <span className="text-white text-xl">{card.icon}</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${
              card.changeType === 'increase' ? 'text-red-600' : 
              card.changeType === 'decrease' ? 'text-green-600' : 
              'text-gray-600'
            }`}>
              {card.change}
            </span>
            <span className="text-sm text-gray-500 ml-2">from last week</span>
          </div>
        </div>
      ))}
    </div>
  );
}
