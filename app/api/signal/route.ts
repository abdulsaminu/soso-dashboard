import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // For now, use mock data since we're still setting up the real API
    // Once you have your SoSoValue API key, replace this with real fetch calls
    
    const btcPrice = 69420 + Math.random() * 100;
    const ethPrice = 3800 + Math.random() * 20;
    const solPrice = 180 + Math.random() * 5;
    
    const etfInflow = 340000000 + (Math.random() - 0.5) * 50000000;
    const btcVolumeChange = 2.34 + (Math.random() - 0.5) * 3;
    
    let direction = 'bullish';
    let confidence = 78;
    let reason = '';
    
    if (etfInflow > 200000000 || btcVolumeChange > 20) {
      direction = 'bullish';
      confidence = Math.min(Math.abs(etfInflow / 10000000), 95) + 5;
      reason = `ETF inflow +$${(etfInflow / 1e6).toFixed(0)}M, volume +${btcVolumeChange.toFixed(1)}%. Institutional demand increasing.`;
    } else if (etfInflow < -100000000) {
      direction = 'bearish';
      confidence = Math.min(Math.abs(etfInflow / 10000000), 95) + 5;
      reason = `ETF outflow $${(Math.abs(etfInflow) / 1e6).toFixed(0)}M. Caution advised.`;
    } else {
      direction = 'neutral';
      confidence = 50;
      reason = `ETF flow neutral at $${(etfInflow / 1e6).toFixed(0)}M. Market consolidating.`;
    }
    
    // Save signal to database for accuracy tracking
    await prisma.signal.create({
      data: {
        direction,
        confidence: Math.floor(confidence),
        priceAtTime: btcPrice,
        createdAt: new Date(),
      },
    });
    
    // Calculate past signal accuracy (last 30 days)
    const pastSignals = await prisma.signal.findMany({
      where: { wasCorrect: { not: null } },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    
    const correctCount = pastSignals.filter(s => s.wasCorrect === true).length;
    const accuracy = pastSignals.length > 0 ? (correctCount / pastSignals.length) * 100 : null;
    
    // Mock whale alerts
    const whaleAlerts = [];
    
    return NextResponse.json({
      btc: { price: btcPrice, change24h: btcVolumeChange, volumeChange: btcVolumeChange },
      eth: { price: ethPrice, change24h: 1.5 },
      sol: { price: solPrice, change24h: 3.2 },
      signal: { direction, confidence: Math.floor(confidence), reason, timestamp: new Date().toLocaleTimeString() },
      etfInflow,
      sentiment: { label: direction === 'bullish' ? 'Greed' : direction === 'bearish' ? 'Fear' : 'Neutral', score: confidence },
      whaleAlerts,
      accuracy: accuracy ? `${accuracy.toFixed(0)}%` : null,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
