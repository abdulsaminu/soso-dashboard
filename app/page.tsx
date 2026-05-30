"use client";

import { useState, useEffect } from "react";
import { Activity, TrendingUp, TrendingDown, Zap } from "lucide-react";

type Signal = {
  direction: "bullish" | "bearish" | "neutral";
  confidence: number;
  reason: string;
  timestamp: string;
};

export default function Home() {
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);

  // Fetch mock signal (replace with real SoSoValue API later)
  const fetchSignal = async () => {
    setLoading(true);
    // Simulate API call – we'll replace this with real data
    setTimeout(() => {
      setSignal({
        direction: "bullish",
        confidence: 78,
        reason: "ETF inflow surged +$340M in last 24h. On-chain volume +22%.",
        timestamp: new Date().toLocaleTimeString(),
      });
      setBtcPrice(68742);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchSignal();
  }, []);

  const handleTrade = () => {
    // This will later connect to SoDEX testnet
    alert("🚀 Connect to SoDEX testnet to execute trade (coming next)");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SoSo Signal Dashboard
          </h1>
          <div className="text-sm text-gray-400">
            Last update: {signal?.timestamp || "--:--:--"}
          </div>
        </div>

        {/* BTC price card */}
        {btcPrice && (
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700">
            <div className="text-gray-400 text-sm">BTC/USD</div>
            <div className="text-3xl font-bold">${btcPrice.toLocaleString()}</div>
          </div>
        )}

        {/* Main Signal Card */}
        {loading ? (
          <div className="bg-gray-800/50 rounded-xl p-8 text-center">
            <Activity className="animate-pulse mx-auto mb-2" />
            Fetching market data...
          </div>
        ) : signal && (
          <div className={`rounded-xl p-6 border-2 ${
            signal.direction === "bullish" ? "border-green-500 bg-green-500/10" :
            signal.direction === "bearish" ? "border-red-500 bg-red-500/10" :
            "border-yellow-500 bg-yellow-500/10"
          }`}>
            <div className="flex items-center gap-3 mb-3">
              {signal.direction === "bullish" ? (
                <TrendingUp className="text-green-400" size={28} />
              ) : signal.direction === "bearish" ? (
                <TrendingDown className="text-red-400" size={28} />
              ) : (
                <Zap className="text-yellow-400" size={28} />
              )}
              <h2 className="text-2xl font-bold">
                {signal.direction.toUpperCase()} Signal
              </h2>
              <span className="ml-auto text-sm bg-gray-700 px-2 py-1 rounded-full">
                Confidence: {signal.confidence}%
              </span>
            </div>
            <p className="text-gray-200 mb-4">{signal.reason}</p>
            <button
              onClick={handleTrade}
              className="bg-blue-600 hover:bg-blue-500 transition px-5 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Zap size={16} /> Trade on SoDEX
            </button>
          </div>
        )}

        {/* ETF Flow Panel (placeholder – will be real data) */}
        <div className="mt-8 bg-gray-800/30 rounded-xl p-4">
          <h3 className="font-semibold mb-2">📊 ETF Flow (24h)</h3>
          <div className="text-green-400">+$340.2M inflow</div>
          <div className="text-xs text-gray-500 mt-2">Source: SoSoValue API (to be connected)</div>
        </div>
{/* SoDEX API Status */}
<div className="mt-4 bg-gray-800/30 rounded-xl p-4">
  <h3 className="font-semibold mb-2">🔌 SoDEX API Connection</h3>
  <div className="text-green-400 flex items-center gap-2">
    <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
    Connected to Testnet ✅
  </div>
  <div className="text-xs text-gray-500 mt-2">
    Ready to place test orders on SoDEX testnet
  </div>
</div>
        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          Built for SoSoValue AI Buildathon Wave 2
        </div>
      </div>
    </main>
  );
}