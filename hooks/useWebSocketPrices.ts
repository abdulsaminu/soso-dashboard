import { useEffect, useState } from 'react';

// This is like a blueprint for what prices we will track
interface PriceData {
  btc: number | null;
  eth: number | null;
  sol: number | null;
}

// This is the magic function we will use in our dashboard
export const useWebSocketPrices = () => {
  // These are like little memory boxes that remember the current prices
  const [prices, setPrices] = useState<PriceData>({ btc: null, eth: null, sol: null });
  const [isConnected, setIsConnected] = useState(false);

  // useEffect runs once when the dashboard starts
  useEffect(() => {
    // Step 1: Connect to SoDEX's price server (the "string between cups")
    const ws = new WebSocket('wss://testnet-gw.sodex.dev/ws/spot');
    
    // This variable will keep the connection alive
    let pingInterval: NodeJS.Timeout;

    // Step 2: When the connection opens successfully...
    ws.onopen = () => {
      console.log('Connected to price server!');
      setIsConnected(true);
      
      // Subscribe to BTC, ETH, SOL prices (tell the server what we want)
      ws.send(JSON.stringify({
        method: "SUBSCRIBE",
        params: ["btc-usdt@markPrice", "eth-usdt@markPrice", "sol-usdt@markPrice"],
        id: 1
      }));
      
      // Send a little "hello" every 30 seconds to keep the connection alive
      pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ method: "PING" }));
        }
      }, 30000);
    };

    // Step 3: When a new price arrives...
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Check if this message contains a price update
      if (data.stream && data.data) {
        // Extract the symbol (BTC, ETH, or SOL) and the price
        const symbol = data.stream.split('@')[0].toUpperCase().replace('-USDT', '');
        const price = parseFloat(data.data.markPrice);
        // Save the price in the correct memory box
        setPrices(prev => ({ ...prev, [symbol.toLowerCase()]: price }));
      }
    };

    // Step 4: If something goes wrong, log the error
    ws.onerror = (error) => console.error('WebSocket error:', error);
    
    // Step 5: When we close the dashboard, clean up
    ws.onclose = () => {
      console.log('Disconnected from price server');
      setIsConnected(false);
      clearInterval(pingInterval);
    };

    // This cleanup runs automatically when the dashboard is closed
    return () => {
      ws.close();
      clearInterval(pingInterval);
    };
  }, []); // The empty [] means "run this once"

  // Give back the prices and connection status to the dashboard
  return { prices, isConnected };
};
