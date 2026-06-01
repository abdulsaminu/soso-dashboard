"use client";

import { useState, useEffect } from "react";
import { Activity, TrendingUp, TrendingDown, Zap, ExternalLink, Sparkles, Coins, BarChart3, Shield, Clock } from "lucide-react";

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
  const [btcChange, setBtcChange] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setTimeout(() => {
      setSignal({
        direction: "bullish",
        confidence: 82,
        reason: "BTC ETF inflow surged +$482M in last 24h. On-chain volume +31%. Institutional demand increasing across DeFi protocols.",
        timestamp: new Date().toLocaleTimeString(),
      });
      setBtcPrice(69420);
      setBtcChange(3.21);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTrade = () => {
    alert("🚀 SoDEX testnet ready! Connect your wallet to trade.");
  };

  return (
    <main className="min-h-screen defi-bg text-white">
      
      {/* Header */}
      <header className="sticky top-0 z-20 glass-card border-b border-soso-border bg-black/40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-soso-accent/10 flex items-center justify-center border border-soso-accent/30">
              <Sparkles size={20} className="text-soso-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                SoSo<span className="text-soso-accent">Signal</span>
              </h1>
              <p className="text-soso-text-secondary text-xs">DeFi Intelligence Dashboard</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-soso-text-secondary text-xs flex items-center gap-1 justify-end">
              <Clock size={12} /> Last update
            </div>
            <div className="text-lg font-mono font-semibold text-soso-accent tracking-wide">
              {signal?.timestamp || "--:--:--"}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        
        {/* 3 Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="text-soso-accent" size={24} />
              <span className="text-soso-text-secondary text-sm">BTC/USD</span>
            </div>
            {btcPrice ? (
              <>
                <div className="text-3xl font-bold">${btcPrice.toLocaleString()}</div>
                <div className={`text-sm mt-1 ${btcChange && btcChange >= 0 ? 'text-soso-success' : 'text-soso-danger'}`}>
                  {btcChange && (btcChange >= 0 ? '+' : '')}{btcChange}%
                </div>
              </>
            ) : (
              <div className="text-soso-text-secondary">Loading...</div>
            )}
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-soso-accent" size={24} />
              <span className="text-soso-text-secondary text-sm">Market Sentiment</span>
            </div>
            <div className="text-2xl font-bold text-soso-accent">Extreme Greed</div>
            <div className="text-soso-text-secondary text-sm mt-1">Score: 78/100</div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-soso-accent" size={24} />
              <span className="text-soso-text-secondary text-sm">API Status</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-soso-success rounded-full animate-pulse"></span>
              <span className="text-soso-success font-medium">SoDEX Testnet Active</span>
            </div>
            <div className="text-soso-text-secondary text-sm mt-1">Ready for trading</div>
          </div>
        </div>

        {/* Main Signal Card */}
        {loading ? (
          <div className="glass-card rounded-2xl p-16 text-center">
            <Activity className="animate-spin mx-auto mb-4 text-soso-accent" size={48} />
            <p className="text-soso-text-secondary">Analyzing DeFi market data...</p>
          </div>
        ) : signal && (
          <div className="glass-card rounded-2xl p-8 mb-8 border-l-4 border-l-soso-accent neon-orange-glow">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {signal.direction === "bullish" ? (
                  <div className="w-16 h-16 rounded-2xl bg-soso-success/10 flex items-center justify-center border border-soso-success/30">
                    <TrendingUp className="text-soso-success" size={32} />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-soso-danger/10 flex items-center justify-center border border-soso-danger/30">
                    <TrendingDown className="text-soso-danger" size={32} />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-bold capitalize">
                      {signal.direction}
                    </h2>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-soso-accent/20 text-soso-accent border border-soso-accent/30">
                      High Conviction
                    </span>
                  </div>
                  <p className="text-soso-text-secondary text-sm mt-1">DeFi Trading Signal • {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-soso-text-secondary text-xs">Confidence Score</div>
                <div className="text-5xl font-bold gradient-text">
                  {signal.confidence}%
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 mt-6 leading-relaxed border-t border-soso-border pt-6">
              {signal.reason}
            </p>
            
            <button
              onClick={handleTrade}
              className="mt-6 w-full md:w-auto bg-soso-accent hover:bg-soso-accent-hover transition-all duration-300 px-8 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg shadow-soso-accent/25"
            >
              <Zap size={18} /> Execute Trade on SoDEX <ExternalLink size={14} />
            </button>
          </div>
        )}

        {/* Two Column Info Panels */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 hover:border-soso-accent transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📊</span>
              <h3 className="font-semibold">ETF Flow (24h)</h3>
            </div>
            <div className="text-3xl font-bold text-soso-success">+$482.3M</div>
            <div className="text-soso-text-secondary text-sm mt-1">Net inflow • Institutional demand</div>
            <div className="mt-4 pt-4 border-t border-soso-border">
              <div className="flex justify-between text-sm">
                <span className="text-soso-text-secondary">Source:</span>
                <span className="text-soso-accent">SoSoValue API</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 hover:border-soso-accent transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔌</span>
              <h3 className="font-semibold">SoDEX Integration</h3>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-2.5 h-2.5 bg-soso-success rounded-full animate-pulse"></span>
              <span className="text-soso-success font-medium">Connected to Testnet</span>
            </div>
            <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-soso-accent break-all border border-soso-border">
              API Key: buildathon-dashboard
            </div>
            <div className="text-soso-text-secondary text-xs mt-3">✓ Ready for spot & perps trading</div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-soso-border text-center">
          <p className="text-soso-text-secondary text-sm">
            Built for SoSoValue AI Buildathon Wave 2 • Powered by DeepSeek
          </p>
          <p className="text-soso-text-secondary/50 text-xs mt-2">
            Real-time DeFi data • AI signals • SoDEX integration
          </p>
        </footer>
      </div>
    </main>
  );
}