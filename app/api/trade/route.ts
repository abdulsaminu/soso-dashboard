import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { asset, direction, amount } = await request.json();
    
    // This is a mock response for now
    // When you have your SoDEX API key ready, replace this with actual API call
    
    console.log(`Trade requested: ${direction} ${amount} ${asset}`);
    
    // Simulate successful order
    return NextResponse.json({ 
      success: true, 
      order: { 
        id: Math.random().toString(36).substring(7),
        asset, 
        side: direction === 'bullish' ? 'buy' : 'sell',
        amount: amount || 0.001,
        status: 'filled',
        message: 'Test order placed on SoDEX testnet'
      } 
    });
  } catch (error) {
    console.error('Trade error:', error);
    return NextResponse.json({ error: 'Trade failed' }, { status: 500 });
  }
}
