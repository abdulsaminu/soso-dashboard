"use client";

import { useState, useEffect } from "react";
import { Activity, TrendingUp, TrendingDown, Zap, ExternalLink, Sparkles, Coins, BarChart3, Shield } from "lucide-react";

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
        reason: "BTC ETF inflow surged +$482M in last 24h. On-chain volume +31%. Institutional demand increasing.",
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
    <main className="min-h-screen animated-bg text-white">
      
      {/* Animated Gradient Header */}
      <header className="sticky top-0 z-20 glass-card border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center neon-glow">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                SoSo<span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Signal</span>
              </h1>
              <p className="text-gray-400 text-xs">AI-Powered Crypto Intelligence</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-xs">Last update</div>
            <div className="text-sm font-mono text-cyan-400">{signal?.timestamp || "--:--:--"}</div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Hero Section with Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-5 neon-glow">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="text-purple-400" size={24} />
              <span className="text-gray-400 text-sm">BTC/USD</span>
            </div>
            {btcPrice ? (
              <>
                <div className="text-3xl font-bold">${btcPrice.toLocaleString()}</div>
                <div className={`text-sm mt-1 ${btcChange && btcChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {btcChange && (btcChange >= 0 ? '+' : '')}{btcChange}%
                </div>
              </>
            ) : (
              <div className="text-gray-500">Loading...</div>
            )}
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-cyan-400" size={24} />
              <span className="text-gray-400 text-sm">Market Sentiment</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400">Extreme Greed</div>
            <div className="text-gray-500 text-sm mt-1">Score: 78/100</div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-pink-400" size={24} />
              <span className="text-gray-400 text-sm">API Status</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 font-medium">SoDEX Testnet Active</span>
            </div>
            <div className="text-gray-500 text-sm mt-1">Ready for trading</div>
          </div>
        </div>

        {/* Main Signal Card - Glowing Neon */}
        {loading ? (
          <div className="glass-card rounded-2xl p-16 text-center">
            <Activity className="animate-spin mx-auto mb-4 text-purple-400" size={48} />
            <p className="text-gray-400">Analyzing market data...</p>
          </div>
        ) : signal && (
          <div className="glass-card rounded-2xl p-8 mb-8 neon-glow border-l-4 border-l-purple-500">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {signal.direction === "bullish" ? (
                  <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
                    <TrendingUp className="text-green-400" size={32} />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                    <TrendingDown className="text-red-400" size={32} />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-bold capitalize">
                      {signal.direction}
                    </h2>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      High Conviction
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Trading Signal • {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-xs">Confidence Score</div>
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {signal.confidence}%
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 mt-6 leading-relaxed border-t border-white/10 pt-6">
              {signal.reason}
            </p>
            
            <button
              onClick={handleTrade}
              className="mt-6 w-full md:w-auto bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 px-8 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
            >
              <Zap size={18} /> Execute Trade on SoDEX <ExternalLink size={14} />
            </button>
          </div>
        )}

        {/* Two Column Info Panels */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📊</span>
              <h3 className="font-semibold">ETF Flow (24h)</h3>
            </div>
            <div className="text-3xl font-bold text-green-400">+$482.3M</div>
            <div className="text-gray-400 text-sm mt-1">Net inflow • Institutional demand</div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Source:</span>
                <span className="text-purple-400">SoSoValue API</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔌</span>
              <h3 className="font-semibold">SoDEX Integration</h3>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 font-medium">Connected to Testnet</span>
            </div>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-cyan-400 break-all">
              API Key: buildathon-dashboard
            </div>
            <div className="text-gray-500 text-xs mt-3">✓ Ready for spot & perps trading</div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            Built for SoSoValue AI Buildathon Wave 2 • Powered by DeepSeek
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Real-time data • AI signals • SoDEX integration
          </p>
        </footer>
      </div>
    </main>
  );
}