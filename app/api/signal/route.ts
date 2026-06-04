import { NextResponse } from 'next/server';

// Helper to fetch ticker from SoDEX MAINNET
async function getSoDEXTicker(symbol: string) {
  const sodexSymbol = `${symbol}-USD`;
  // Using MAINNET endpoint instead of testnet
  const url = `https://mainnet-gw.sodex.dev/api/v1/spot/ticker?symbol=${sodexSymbol}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 5 } });
    if (!response.ok) throw new Error(`Ticker fetch failed for ${sodexSymbol}`);
    const data = await response.json();
    
    return {
      price: parseFloat(data.lastPrice),
      change24h: parseFloat(data.priceChangePercent),
      volume: parseFloat(data.volume),
    };
  } catch (error) {
    console.error(`Error fetching ticker for ${symbol}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    // Fetch real MAINNET prices
    const [btcData, ethData, solData] = await Promise.all([
      getSoDEXTicker('BTC'),
      getSoDEXTicker('ETH'),
      getSoDEXTicker('SOL'),
    ]);

    // If all fetches fail, fall back to mock data
    if (!btcData && !ethData && !solData) {
      return getMockData();
    }

    // Calculate signal based on 24h price change
    const btcPriceChange = btcData?.change24h ?? 0;
    let direction = 'neutral';
    let confidence = 50;
    let reason = '';

    if (btcPriceChange > 2) {
      direction = 'bullish';
      confidence = Math.min(60 + btcPriceChange * 5, 95);
      reason = `Bullish momentum. BTC is up +${btcPriceChange.toFixed(1)}% in the last 24 hours.`;
    } else if (btcPriceChange < -2) {
      direction = 'bearish';
      confidence = Math.min(60 + Math.abs(btcPriceChange) * 5, 95);
      reason = `Bearish momentum. BTC is down ${btcPriceChange.toFixed(1)}% in the last 24 hours.`;
    } else {
      direction = 'neutral';
      confidence = 50;
      reason = `Market ranging. BTC is ${btcPriceChange.toFixed(1)}% in the last 24 hours.`;
    }

    // Calculate sentiment from price change
    const sentimentScore = 50 + btcPriceChange * 5;
    const sentiment = {
      label: btcPriceChange > 3 ? 'Extreme Greed' : btcPriceChange > 1 ? 'Greed' : btcPriceChange < -3 ? 'Extreme Fear' : btcPriceChange < -1 ? 'Fear' : 'Neutral',
      score: Math.min(Math.max(sentimentScore, 0), 100),
    };

    return NextResponse.json({
      btc: { price: btcData?.price ?? 0, change24h: btcData?.change24h ?? 0, volumeChange: 0 },
      eth: { price: ethData?.price ?? 0, change24h: ethData?.change24h ?? 0 },
      sol: { price: solData?.price ?? 0, change24h: solData?.change24h ?? 0 },
      signal: {
        direction,
        confidence: Math.floor(confidence),
        reason,
        timestamp: new Date().toLocaleTimeString(),
      },
      etfInflow: 0,
      sentiment,
      whaleAlerts: [],
      accuracy: '—',
    });

  } catch (error) {
    console.error('API error:', error);
    return getMockData();
  }
}

// Fallback mock data
function getMockData() {
  return NextResponse.json({
    btc: { price: 63399, change24h: 1.2, volumeChange: 0 },
    eth: { price: 3480, change24h: 0.8 },
    sol: { price: 175, change24h: 2.1 },
    signal: {
      direction: "bullish",
      confidence: 65,
      reason: "Market showing upward momentum.",
      timestamp: new Date().toLocaleTimeString(),
    },
    etfInflow: 0,
    sentiment: { label: "Greed", score: 65 },
    whaleAlerts: [],
    accuracy: '—',
  });
}
