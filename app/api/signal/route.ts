import { NextResponse } from 'next/server';

// Helper to fetch price from CoinGecko (free, no API key, reliable)
async function getCoinGeckoPrice(coinId: string) {
  try {
    // CoinGecko IDs: bitcoin, ethereum, solana
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`;
    const response = await fetch(url, { 
      next: { revalidate: 10 }, // Refresh every 10 seconds
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) throw new Error(`CoinGecko API error: ${response.status}`);
    
    const data = await response.json();
    
    return {
      price: data[coinId]?.usd || 0,
      change24h: data[coinId]?.usd_24h_change || 0,
    };
  } catch (error) {
    console.error(`Error fetching ${coinId}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    // Fetch real prices from CoinGecko
    const [btcData, ethData, solData] = await Promise.all([
      getCoinGeckoPrice('bitcoin'),
      getCoinGeckoPrice('ethereum'),
      getCoinGeckoPrice('solana'),
    ]);

    // If all fetches fail, fall back to mock data
    if (!btcData && !ethData && !solData) {
      console.log('All API calls failed, using mock data');
      return getMockData();
    }

    // Use BTC data for signal calculation
    const btcPriceChange = btcData?.change24h ?? 0;
    let direction = 'neutral';
    let confidence = 50;
    let reason = '';

    if (btcPriceChange > 1) {
      direction = 'bullish';
      confidence = Math.min(55 + Math.abs(btcPriceChange) * 2, 95);
      reason = `Bullish momentum. BTC is up +${btcPriceChange.toFixed(2)}% in the last 24 hours.`;
    } else if (btcPriceChange < -1) {
      direction = 'bearish';
      confidence = Math.min(55 + Math.abs(btcPriceChange) * 2, 95);
      reason = `Bearish momentum. BTC is down ${Math.abs(btcPriceChange).toFixed(2)}% in the last 24 hours.`;
    } else {
      direction = 'neutral';
      confidence = 50;
      reason = `Market ranging. BTC is ${btcPriceChange.toFixed(2)}% in the last 24 hours.`;
    }

    // Calculate sentiment from price change
    const sentimentScore = 50 + btcPriceChange * 3;
    let sentimentLabel = 'Neutral';
    if (btcPriceChange > 3) sentimentLabel = 'Extreme Greed';
    else if (btcPriceChange > 1) sentimentLabel = 'Greed';
    else if (btcPriceChange < -3) sentimentLabel = 'Extreme Fear';
    else if (btcPriceChange < -1) sentimentLabel = 'Fear';

    const sentiment = {
      label: sentimentLabel,
      score: Math.min(Math.max(Math.round(sentimentScore), 0), 100),
    };

    const signalReason = `${reason} ${direction === 'bullish' ? 'Consider long positions.' : direction === 'bearish' ? 'Consider short positions or wait.' : 'Wait for clearer direction.'}`;

    return NextResponse.json({
      btc: { 
        price: btcData?.price ?? 63400, 
        change24h: btcData?.change24h ?? 0, 
      },
      eth: { 
        price: ethData?.price ?? 3480, 
        change24h: ethData?.change24h ?? 0 
      },
      sol: { 
        price: solData?.price ?? 175, 
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
  console.log('Returning mock data');
  return NextResponse.json({
    btc: { price: 63400, change24h: 1.2 },
    eth: { price: 3480, change24h: 0.8 },
    sol: { price: 175, change24h: 2.1 },
    signal: {
      direction: "neutral",
      confidence: 50,
      reason: "Live market data temporarily unavailable. Showing reference prices.",
      timestamp: new Date().toLocaleTimeString(),
    },
    etfInflow: 0,
    sentiment: { label: "Neutral", score: 50 },
    whaleAlerts: [],
    accuracy: '—',
  });
}
