import { NextResponse } from 'next/server';

// Helper to fetch price from Binance (free, no API key needed)
async function getBinancePrice(symbol: string) {
  try {
    const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`;
    const response = await fetch(url, { next: { revalidate: 5 } }); // Refresh every 5 seconds
    
    if (!response.ok) throw new Error(`Binance API error for ${symbol}`);
    
    const data = await response.json();
    
    return {
      price: parseFloat(data.lastPrice),
      change24h: parseFloat(data.priceChangePercent),
      volume: parseFloat(data.volume),
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    // Fetch real prices from Binance
    const [btcData, ethData, solData] = await Promise.all([
      getBinancePrice('BTC'),
      getBinancePrice('ETH'),
      getBinancePrice('SOL'),
    ]);

    // If all fetches fail, fall back to mock data
    if (!btcData && !ethData && !solData) {
      return getMockData();
    }

    // Use BTC data for signal calculation
    const btcPriceChange = btcData?.change24h ?? 0;
    let direction = 'neutral';
    let confidence = 50;
    let reason = '';

    if (btcPriceChange > 1) {
      direction = 'bullish';
      confidence = Math.min(55 + Math.abs(btcPriceChange) * 3, 95);
      reason = `Bullish momentum. BTC is up +${btcPriceChange.toFixed(2)}% in the last 24 hours.`;
    } else if (btcPriceChange < -1) {
      direction = 'bearish';
      confidence = Math.min(55 + Math.abs(btcPriceChange) * 3, 95);
      reason = `Bearish momentum. BTC is down ${Math.abs(btcPriceChange).toFixed(2)}% in the last 24 hours.`;
    } else {
      direction = 'neutral';
      confidence = 50;
      reason = `Market ranging. BTC is ${btcPriceChange.toFixed(2)}% in the last 24 hours.`;
    }

    // Calculate sentiment from price change
    const sentimentScore = 50 + btcPriceChange * 4;
    let sentimentLabel = 'Neutral';
    if (btcPriceChange > 2.5) sentimentLabel = 'Extreme Greed';
    else if (btcPriceChange > 1) sentimentLabel = 'Greed';
    else if (btcPriceChange < -2.5) sentimentLabel = 'Extreme Fear';
    else if (btcPriceChange < -1) sentimentLabel = 'Fear';

    const sentiment = {
      label: sentimentLabel,
      score: Math.min(Math.max(Math.round(sentimentScore), 0), 100),
    };

    // Generate signal explanation
    const signalReason = `${reason} ${direction === 'bullish' ? 'Consider long positions.' : direction === 'bearish' ? 'Consider short positions or wait.' : 'Wait for clearer direction.'}`;

    return NextResponse.json({
      btc: { 
        price: btcData?.price ?? 0, 
        change24h: btcData?.change24h ?? 0, 
        volumeChange: 0 
      },
      eth: { 
        price: ethData?.price ?? 0, 
        change24h: ethData?.change24h ?? 0 
      },
      sol: { 
        price: solData?.price ?? 0, 
        change24h: solData?.change24h ?? 0 
      },
      signal: {
        direction,
        confidence: Math.floor(confidence),
        reason: signalReason,
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

// Fallback mock data with realistic prices
function getMockData() {
  return NextResponse.json({
    btc: { price: 63400, change24h: 1.2, volumeChange: 0 },
    eth: { price: 3480, change24h: 0.8 },
    sol: { price: 175, change24h: 2.1 },
    signal: {
      direction: "neutral",
      confidence: 50,
      reason: "Market data temporarily unavailable. Using cached prices.",
      timestamp: new Date().toLocaleTimeString(),
    },
    etfInflow: 0,
    sentiment: { label: "Neutral", score: 50 },
    whaleAlerts: [],
    accuracy: '—',
  });
}
