// server.ts

import app from './app';
import { getLocalIP } from './dev-core';
import { default as serverlessExpress } from '@vendia/serverless-express';

const isLocal = !process.env.VERCEL && !process.env.AWS_EXECUTION_ENV;

if (isLocal) {
    const PORT = parseInt(process.env.PORT || '5000', 10);
    const localIP = getLocalIP();

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running locally at http://${localIP}:${PORT}`);
    });
}

// Export for Vercel / Serverless
export default serverlessExpress({ app });
