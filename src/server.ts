import app from '.';
import http from 'http';
import os from 'os';
import { getLocalIP } from './dev-core';

const PORT = parseInt(process.env.PORT || "5000", 10);

const localIP = getLocalIP();

const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running at http://${localIP}:${PORT}`);
});
