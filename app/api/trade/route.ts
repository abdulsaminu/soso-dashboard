import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

export async function POST(request: Request) {
  try {
    const { asset, direction, amount } = await request.json();

    // Get credentials from environment variables
    const API_KEY_NAME = process.env.SODEX_API_KEY_NAME;
    const API_KEY_PRIVATE_KEY = process.env.SODEX_API_PRIVATE_KEY;
    const ACCOUNT_ID = process.env.SODEX_ACCOUNT_ID;

    if (!API_KEY_NAME || !API_KEY_PRIVATE_KEY || !ACCOUNT_ID) {
      console.error('SoDEX credentials not configured');
      return NextResponse.json({ success: false, error: 'SoDEX not configured' }, { status: 500 });
    }

    // Map asset to SoDEX symbol ID (you may need to adjust these IDs)
    const symbolMap: { [key: string]: number } = {
      'BTC': 1,
      'ETH': 2,
      'SOL': 3,
    };
    const symbolID = symbolMap[asset];
    if (!symbolID) {
      return NextResponse.json({ success: false, error: 'Unsupported asset' }, { status: 400 });
    }

    // 1. Create the order payload
    const order = {
      clOrdID: `auto_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      side: direction === 'bullish' ? 1 : 2, // 1 = buy, 2 = sell
      type: 2, // 2 = market order
      quantity: amount.toString(),
      reduceOnly: false,
    };

    const payload = {
      type: 'newOrder',
      params: {
        accountID: parseInt(ACCOUNT_ID),
        symbolID: symbolID,
        orders: [order],
      },
    };

    // 2. Generate nonce (current timestamp in milliseconds)
    const nonce = Date.now();

    // 3. Compute payloadHash (EIP-712 requirement)
    const payloadJson = JSON.stringify(payload);
    const payloadHash = ethers.keccak256(ethers.toUtf8Bytes(payloadJson));

    // 4. Create EIP-712 signature
    const domain = {
      name: 'spot',
      version: '1',
      chainId: 138565, // SoDEX testnet chainId
      verifyingContract: '0x0000000000000000000000000000000000000000',
    };

    const types = {
      ExchangeAction: [
        { name: 'payloadHash', type: 'bytes32' },
        { name: 'nonce', type: 'uint64' },
      ],
    };

    const wallet = new ethers.Wallet(API_KEY_PRIVATE_KEY);
    const signature = await wallet.signTypedData(domain, types, {
      payloadHash,
      nonce,
    });

    // 5. Prepend 0x01 for typed signature (SoDEX requirement)
    const typedSignature = '0x01' + signature.slice(2);

    // 6. Send the order to SoDEX testnet
    const response = await fetch(`${process.env.NEXT_PUBLIC_SODEX_TESTNET_URL}/spot/trade/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY_NAME,
        'X-API-Sign': typedSignature,
        'X-API-Nonce': nonce.toString(),
      },
      body: JSON.stringify(payload.params),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('SoDEX API error:', responseData);
      throw new Error(responseData.message || 'Order placement failed');
    }

    return NextResponse.json({ success: true, order: responseData });

  } catch (error: any) {
    console.error('Trade error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Trade failed' }, { status: 500 });
  }
}
