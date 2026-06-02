"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

// Mock price data (will be replaced with real API data)
const generateMockData = () => {
  const data = [];
  let price = 68000;
  for (let i = 30; i >= 0; i--) {
    const change = (Math.random() - 0.5) * 400;
    price = price + change;
    data.push({
      date: `${i} days ago`,
      price: price,
    });
  }
  return data.reverse();
};

export default function PriceChart() {
  const data = generateMockData();

  return (
    <div className="glass-card p-6 w-full">
      <h3 className="font-semibold mb-4 text-soso-text-primary flex items-center gap-2">
        <span className="text-xl">📈</span> Price Chart (30 Days)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF7300" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FF7300" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#A0A0A0', fontSize: 12 }}
            axisLine={{ stroke: '#2A2A2A' }}
          />
          <YAxis 
            tick={{ fill: '#A0A0A0', fontSize: 12 }}
            axisLine={{ stroke: '#2A2A2A' }}
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#141414',
              border: '1px solid rgba(255, 115, 0, 0.2)',
              borderRadius: '12px',
              color: '#FFFFFF',
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#FF7300"
            strokeWidth={2}
            fill="url(#priceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="text-soso-text-secondary text-xs text-center mt-4">
        Real-time data coming soon with SoSoValue API integration
      </div>
    </div>
  );
}
