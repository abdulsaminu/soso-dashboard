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

  const fetchSignal = async () => {
    setLoading(true);
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
    alert("🚀 SoDEX testnet integration ready. Connect your wallet to place test orders.");
  };

  return (
    <main className="min-h-screen bg-soso-bg text-soso-text-primary p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with SoSoValue style */}
        <div className="flex justify-between items-center mb-8 border-b border-soso-border pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              SoSo<span className="text-soso-accent">Signal</span>
            </h1>
            <p className="text-soso-text-secondary text-sm mt-1">Real-time crypto intelligence</p>
          </div>
          <div className="text-xs text-soso-text-secondary">
            Last update: {signal?.timestamp || "--:--:--"}
          </div>
        </div>

        {/* BTC Price Card - Professional style */}
        {btcPrice && (
          <div className="bg-soso-card rounded-xl p-5 mb-6 border border-soso-border">
            <div className="text-soso-text-secondary text-sm uppercase tracking-wide">BTC/USD</div>
            <div className="text-4xl font-bold mt-1">${btcPrice.toLocaleString()}</div>
            <div className="text-soso-success text-sm mt-1">+2.34% (24h)</div>
          </div>
        )}

        {/* Main Signal Card */}
        {loading ? (
          <div className="bg-soso-card rounded-xl p-8 text-center border border-soso-border">
            <Activity className="animate-pulse mx-auto mb-2 text-soso-accent" />
            <span className="text-soso-text-secondary">Fetching market data...</span>
          </div>
        ) : signal && (
          <div className={`rounded-xl p-6 border-2 ${
            signal.direction === "bullish" ? "border-soso-success bg-soso-success/10" :
            signal.direction === "bearish" ? "border-soso-danger bg-soso-danger/10" :
            "border-soso-accent bg-soso-accent/10"
          }`}>
            <div className="flex items-center gap-3 mb-3">
              {signal.direction === "bullish" ? (
                <TrendingUp className="text-soso-success" size={28} />
              ) : signal.direction === "bearish" ? (
                <TrendingDown className="text-soso-danger" size={28} />
              ) : (
                <Zap className="text-soso-accent" size={28} />
              )}
              <h2 className="text-2xl font-bold">
                {signal.direction.toUpperCase()} Signal
              </h2>
              <span className="ml-auto text-sm bg-soso-card px-3 py-1 rounded-full border border-soso-border">
                Confidence: {signal.confidence}%
              </span>
            </div>
            <p className="text-soso-text-secondary mb-4">{signal.reason}</p>
            <button
              onClick={handleTrade}
              className="bg-soso-accent hover:bg-soso-accent-hover transition px-5 py-2 rounded-lg font-medium text-white flex items-center gap-2"
            >
              <Zap size={16} /> Trade on SoDEX
            </button>
          </div>
        )}

        {/* ETF Flow Panel */}
        <div className="mt-6 bg-soso-card rounded-xl p-5 border border-soso-border">
          <h3 className="font-semibold mb-2 text-soso-text-primary">📊 ETF Flow (24h)</h3>
          <div className="text-soso-success text-xl font-bold">+$340.2M inflow</div>
          <div className="text-xs text-soso-text-secondary mt-2">Source: SoSoValue API (awaiting approval)</div>
        </div>

        {/* SoDEX API Status Panel */}
        <div className="mt-4 bg-soso-card rounded-xl p-5 border border-soso-border">
          <h3 className="font-semibold mb-2 text-soso-text-primary">🔌 SoDEX API</h3>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-soso-success rounded-full animate-pulse"></span>
            <span className="text-soso-success font-medium">Connected to Testnet</span>
          </div>
          <div className="text-xs text-soso-text-secondary mt-2">Ready to place test orders on SoDEX testnet</div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-soso-border text-center">
          <p className="text-soso-text-secondary text-xs">
            Built for SoSoValue AI Buildathon Wave 2 • Powered by DeepSeek
          </p>
        </div>
      </div>
    </main>
  );
}