// src/setupProxy.ts
import { createProxyMiddleware } from 'http-proxy-middleware';

export default function(app: any) {
    app.use(
        '/maps/api',
        createProxyMiddleware({
            target: 'https://maps.googleapis.com',
            changeOrigin: true,
        })
    );
};
