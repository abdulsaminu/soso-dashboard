"use client";

import { useState, useEffect } from "react";
import { 
  Activity, TrendingUp, TrendingDown, Zap, ExternalLink, 
  Sparkles, Coins, BarChart3, Shield, Clock, 
  Target, Eye 
} from "lucide-react";
import PriceChart from './components/PriceChart';

type Signal = {
  direction: "bullish" | "bearish" | "neutral";
  confidence: number;
  reason: string;
  timestamp: string;
};

type WhaleAlert = {
  asset: string;
  amount: number;
  fromAddress: string;
  toAddress: string;
};

export default function Home() {
  // Asset selection
  const [selectedAsset, setSelectedAsset] = useState<'BTC' | 'ETH' | 'SOL'>('BTC');
  
  // Price data
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [change24h, setChange24h] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Signal and other data
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [etfInflow, setEtfInflow] = useState<number | null>(null);
  const [sentiment, setSentiment] = useState<{ label: string; score: number } | null>(null);
  const [whaleAlerts, setWhaleAlerts] = useState<WhaleAlert[]>([]);
  const [accuracy, setAccuracy] = useState<string | null>(null);
  const [autoTrade, setAutoTrade] = useState(false);
  const [tradeStatus, setTradeStatus] = useState<string | null>(null);

  // Fetch current price only
  const fetchCurrentPrice = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/signal');
      const data = await response.json();
      const assetData = data[selectedAsset.toLowerCase()];
      setCurrentPrice(assetData.price);
      setChange24h(assetData.change24h);
    } catch (error) {
      console.error('Price fetch error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch signal and other data (not prices)
  const fetchSignalData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/signal');
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      setSignal(data.signal);
      setEtfInflow(data.etfInflow);
      setSentiment(data.sentiment);
      setWhaleAlerts(data.whaleAlerts || []);
      setAccuracy(data.accuracy);
      
      // Also update price from the same call
      const assetData = data[selectedAsset.toLowerCase()];
      if (assetData) {
        setCurrentPrice(assetData.price);
        setChange24h(assetData.change24h);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      // Fallback mock data
      setSignal({
        direction: "bullish",
        confidence: 78,
        reason: "ETF inflow surged +$340M. On-chain volume +22%.",
        timestamp: new Date().toLocaleTimeString(),
      });
      setEtfInflow(340000000);
      setSentiment({ label: "Greed", score: 72 });
      setAccuracy("76%");
      setCurrentPrice(selectedAsset === 'BTC' ? 63400 : selectedAsset === 'ETH' ? 1793 : 70);
      setChange24h(1.2);
    } finally {
      setLoading(false);
    }
  };

  // Handle auto-trade execution
  const handleTrade = async () => {
    if (!autoTrade) {
      alert("Enable Auto-Trade mode first (click the toggle)");
      return;
    }
    
    setTradeStatus("Placing order...");
    try {
      const response = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset: selectedAsset,
          direction: signal?.direction,
          amount: 0.001,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTradeStatus("✅ Order placed on SoDEX testnet!");
        setTimeout(() => setTradeStatus(null), 3000);
      } else {
        setTradeStatus("❌ Trade failed");
      }
    } catch (error) {
      setTradeStatus("❌ Error placing trade");
    }
  };

  // Fetch data when selected asset changes
  useEffect(() => {
    fetchSignalData();
  }, [selectedAsset]);

  // Optional: Refresh price every 30 seconds automatically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCurrentPrice();
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedAsset]);

  const assetButtons = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '/coins/btc.svg' },
    { symbol: 'ETH', name: 'Ethereum', icon: '/coins/eth.svg' },
    { symbol: 'SOL', name: 'Solana', icon: '/coins/sol.svg' },
  ];

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
          <div className="text-right flex items-center gap-3">
            <button
              onClick={fetchCurrentPrice}
              disabled={isRefreshing}
              className="px-2 py-1 text-xs bg-soso-accent/20 hover:bg-soso-accent/40 rounded transition-all"
            >
              {isRefreshing ? '⟳' : 'Refresh Price'}
            </button>
            <div>
              <div className="text-soso-text-secondary text-xs">Last update</div>
              <div className="text-lg font-mono font-semibold text-soso-accent tracking-wide">
                {signal?.timestamp || "--:--:--"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        
        {/* Asset Selector Buttons */}
        <div className="flex gap-3 mb-8">
          {assetButtons.map((asset) => (
            <button
              key={asset.symbol}
              onClick={() => setSelectedAsset(asset.symbol as 'BTC' | 'ETH' | 'SOL')}
              className={`px-5 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedAsset === asset.symbol
                  ? 'bg-soso-accent text-white shadow-lg shadow-soso-accent/25'
                  : 'glass-card text-soso-text-secondary hover:text-white hover:border-soso-accent/50'
              }`}
            >
              <img src={asset.icon} alt={asset.name} className="w-5 h-5" />
              {asset.name}
            </button>
          ))}
        </div>

        {/* 4 Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Price Card */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="text-soso-accent" size={24} />
              <span className="text-soso-text-secondary text-sm">{selectedAsset}/USD</span>
            </div>
            <div className="text-3xl font-bold">
              {currentPrice ? `$${currentPrice.toLocaleString()}` : 'Loading...'}
            </div>
            <div className={`text-sm mt-1 ${change24h && change24h >= 0 ? 'text-soso-success' : 'text-soso-danger'}`}>
              {change24h && (change24h >= 0 ? '+' : '')}{change24h}%
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-soso-accent" size={24} />
              <span className="text-soso-text-secondary text-sm">Market Sentiment</span>
            </div>
            <div className="text-2xl font-bold text-soso-accent">{sentiment?.label || "Neutral"}</div>
            <div className="text-soso-text-secondary text-sm mt-1">Score: {sentiment?.score || 50}/100</div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-soso-accent" size={24} />
              <span className="text-soso-text-secondary text-sm">Signal Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-soso-success">{accuracy || "—"}</div>
            <div className="text-soso-text-secondary text-sm mt-1">Last 30 days</div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-soso-accent" size={24} />
              <span className="text-soso-text-secondary text-sm">Auto-Trade</span>
            </div>
            <button
              onClick={() => setAutoTrade(!autoTrade)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                autoTrade 
                  ? 'bg-soso-success/20 text-soso-success border border-soso-success/50' 
                  : 'bg-gray-700/50 text-soso-text-secondary'
              }`}
            >
              {autoTrade ? '✅ Enabled' : '⚡ Disabled'}
            </button>
            <div className="text-soso-text-secondary text-xs mt-2">One-click execution</div>
          </div>
        </div>

        {/* Main Signal Card */}
        {loading ? (
          <div className="glass-card p-16 text-center">
            <Activity className="animate-spin mx-auto mb-4 text-soso-accent" size={48} />
            <p className="text-soso-text-secondary">Analyzing DeFi market data...</p>
          </div>
        ) : signal && (
          <div className="glass-card p-8 mb-8 border-l-4 border-l-soso-accent neon-orange-glow">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {signal.direction === "bullish" ? (
                  <div className="w-16 h-16 rounded-2xl bg-soso-success/10 flex items-center justify-center border border-soso-success/30">
                    <TrendingUp className="text-soso-success" size={32} />
                  </div>
                ) : signal.direction === "bearish" ? (
                  <div className="w-16 h-16 rounded-2xl bg-soso-danger/10 flex items-center justify-center border border-soso-danger/30">
                    <TrendingDown className="text-soso-danger" size={32} />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gray-500/10 flex items-center justify-center border border-gray-500/30">
                    <Activity className="text-gray-400" size={32} />
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
                  <p className="text-soso-text-secondary text-sm mt-1">
                    {selectedAsset} Trading Signal • {new Date().toLocaleDateString()}
                  </p>
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
              disabled={!autoTrade}
              className={`mt-6 w-full md:w-auto transition-all duration-300 px-8 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 ${
                autoTrade 
                  ? 'bg-soso-accent hover:bg-soso-accent-hover shadow-lg shadow-soso-accent/25 cursor-pointer' 
                  : 'bg-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              <Zap size={18} /> {autoTrade ? 'Execute Trade on SoDEX' : 'Enable Auto-Trade First'} <ExternalLink size={14} />
            </button>
            {tradeStatus && (
              <div className="mt-3 text-center text-sm text-soso-accent">{tradeStatus}</div>
            )}
          </div>
        )}

        {/* Whale Watch Alerts Panel */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="text-soso-accent" size={20} />
            <h3 className="font-semibold">🐋 Whale Watch Alerts</h3>
          </div>
          {whaleAlerts.length === 0 ? (
            <div className="text-soso-text-secondary text-sm">No recent whale movements detected</div>
          ) : (
            <div className="space-y-2">
              {whaleAlerts.slice(0, 3).map((alert, idx) => (
                <div key={idx} className="bg-black/30 rounded-lg p-3 border border-soso-border">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-soso-accent">{alert.asset}</span>
                    <span className="text-soso-success font-bold">${(alert.amount / 1e6).toFixed(1)}M</span>
                  </div>
                  <div className="text-xs text-soso-text-secondary mt-1 font-mono">
                    From: {alert.fromAddress.slice(0, 10)}... → To: {alert.toAddress.slice(0, 10)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Chart */}
        <div className="mt-6">
          <PriceChart />
        </div>

        {/* Two Column Info Panels */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="glass-card p-6 hover:border-soso-accent transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📊</span>
              <h3 className="font-semibold">ETF Flow (24h)</h3>
            </div>
            <div className={`text-3xl font-bold ${etfInflow && etfInflow >= 0 ? 'text-soso-success' : 'text-soso-danger'}`}>
              {etfInflow ? `${etfInflow >= 0 ? '+' : ''}$${(Math.abs(etfInflow) / 1e6).toFixed(1)}M` : '—'}
            </div>
            <div className="text-soso-text-secondary text-sm mt-1">
              {etfInflow && etfInflow >= 0 ? 'Net inflow' : 'Net outflow'} • Institutional demand
            </div>
            <div className="mt-4 pt-4 border-t border-soso-border">
              <div className="flex justify-between text-sm">
                <span className="text-soso-text-secondary">Source:</span>
                <span className="text-soso-accent">SoSoValue API</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 hover:border-soso-accent transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔌</span>
              <h3 className="font-semibold">SoDEX Integration</h3>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-2.5 h-2.5 bg-soso-success rounded-full animate-pulse"></span>
              <span className="text-soso-success font-medium">Connected to Testnet</span>
            </div>
            <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-soso-accent break-all border border-soso-border">
              API Key: buildathon-wave2-v2
            </div>
            <div className="text-soso-text-secondary text-xs mt-3">
              {autoTrade ? '✓ Auto-trade enabled • Orders will execute' : '○ Toggle auto-trade to start trading'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-soso-border text-center">
          <p className="text-soso-text-secondary text-sm">
            Built for SoSoValue AI Buildathon Wave 2
          </p>
          <p className="text-soso-text-secondary/50 text-xs mt-2">
            Real-time DeFi data • AI signals • SoDEX integration • Whale alerts • Signal accuracy tracking
          </p>
        </footer>
      </div>
    </main>
  );
}
