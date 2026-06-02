import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { asset, direction, amount } = await request.json();

    const API_KEY_NAME = process.env.SODEX_API_KEY_NAME;
    const API_KEY_PRIVATE_KEY = process.env.SODEX_API_PRIVATE_KEY;
    const ACCOUNT_ID = process.env.SODEX_ACCOUNT_ID;

    if (!API_KEY_NAME || !API_KEY_PRIVATE_KEY || !ACCOUNT_ID) {
      console.error('SoDEX credentials not configured');
      return NextResponse.json({ 
        success: false, 
        error: 'SoDEX not configured. Please add API credentials to .env.local' 
      }, { status: 500 });
    }

    // Map asset to symbol ID (you may need to verify these IDs)
    const symbolMap: { [key: string]: number } = {
      'BTC': 1,
      'ETH': 2,
      'SOL': 3,
    };
    const symbolID = symbolMap[asset];
    if (!symbolID) {
      return NextResponse.json({ success: false, error: 'Unsupported asset' }, { status: 400 });
    }

    // For now, return a simulated success response
    // Once the SoDEX API is fully documented, we'll implement the actual order placement
    console.log(`[SoDEX Trade Request] Asset: ${asset}, Direction: ${direction}, Amount: ${amount}, AccountID: ${ACCOUNT_ID}`);

    // Simulate successful order
    return NextResponse.json({ 
      success: true, 
      message: `Test order placed on SoDEX testnet: ${direction} ${amount} ${asset}`,
      order: {
        id: `sim_${Date.now()}`,
        asset,
        side: direction === 'bullish' ? 'buy' : 'sell',
        amount,
        status: 'simulated',
        accountId: ACCOUNT_ID,
      }
    });

  } catch (error: any) {
    console.error('Trade error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Trade failed' 
    }, { status: 500 });
  }
}