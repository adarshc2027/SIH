import dns from 'dns';

dns.setServers([
  '8.8.8.8',
  '1.1.1.1'
]);

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(
        `[MoTA Portal Backend] Server running in ${
          process.env.NODE_ENV || 'development'
        } mode on port ${PORT}`
      );

      console.log(
        `[MoTA Portal Backend] Health check: http://localhost:${PORT}/api/health`
      );
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');

      server.close(() => {
        console.log('HTTP server closed');
      });
    });

  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();