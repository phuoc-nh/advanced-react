import { env } from './env';

/**
 * Keep-alive service to prevent Render free tier from spinning down
 * Pings the server health endpoint every 10 minutes when in production
 */

let keepAliveInterval: NodeJS.Timeout | null = null;

interface KeepAliveOptions {
  interval?: number; // Interval in milliseconds
  immediate?: boolean; // Whether to ping immediately on start
}

export function startKeepAlive(options: KeepAliveOptions = {}) {
  const { interval = 5 * 60 * 1000, immediate = true } = options; // Default 5 minutes
  // Only run in production environment
  if (import.meta.env.DEV) {
    console.log('🛌 Keep-alive disabled in development mode');
    return;
  }

  // Don't start multiple intervals
  if (keepAliveInterval) {
    console.log('⚠️ Keep-alive already running');
    return;
  }

  console.log('🚀 Starting keep-alive service');
  console.log(`📡 Will ping ${env.VITE_SERVER_BASE_URL}/health every ${interval / 1000 / 60} minutes`);

  // Start pinging immediately if requested
  if (immediate) {
    pingServer();
  }

  // Set up interval to ping
  keepAliveInterval = setInterval(() => {
    pingServer();
  }, interval);
}

export function stopKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log('🛑 Keep-alive service stopped');
  }
}

async function pingServer() {
  try {
    const response = await fetch(`${env.VITE_SERVER_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('💚 Keep-alive ping successful:', data.timestamp);
    } else {
      console.log('💛 Keep-alive ping failed with status:', response.status);
    }
  } catch (error) {
    console.log('❌ Keep-alive ping failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Export for manual testing
export { pingServer };
