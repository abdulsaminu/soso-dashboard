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

// Generate mock data
const generateMockData = () => {
  const data = [];
  let price = 68000;
  for (let i = 30; i >= 0; i--) {
    const change = (Math.random() - 0.5) * 400;
    price = price + change;
    data.push({
      date: `${i} days ago`,
      price: Math.round(price),
    });
  }
  return data.reverse();
};

export default function PriceChart() {
  const data = generateMockData();

  return (
    <div className="glass-card p-6 w-full">
      <h3 className="font-semibold mb-4 text-white flex items-center gap-2">
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
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#999', fontSize: 12 }}
            axisLine={{ stroke: '#333' }}
          />
          <YAxis 
            tick={{ fill: '#999', fontSize: 12 }}
            axisLine={{ stroke: '#333' }}
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1a1a1a', 
              border: '1px solid #FF7300',
              borderRadius: '8px',
              color: 'white'
            }} 
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
      <div className="text-gray-500 text-xs text-center mt-4">
        Live price data coming soon
      </div>
    </div>
  );
}
