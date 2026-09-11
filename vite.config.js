import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom Backend Pricing Validation Plugin for Vite Dev Server
function pricingApiPlugin() {
  return {
    name: 'pricing-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const isQuoteEndpoint = req.url === '/api/pricing/validate-quote' || req.url === '/api/validate-quote';
        if (isQuoteEndpoint && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const benchmark = parseFloat(data.benchmarkPrice) || 350;
              const rawTol = data.tolerance !== undefined ? parseFloat(data.tolerance) : 0.25;
              const tol = rawTol > 1 ? rawTol / 100 : rawTol;
              const weight = parseFloat(data.lotWeight || data.quantity) || 0;
              const quote = parseFloat(data.quotedPrice) || 0;
              const unit = data.unit || 'kg';

              const lowerLimit = Math.round(benchmark * (1 - tol));
              const upperLimit = Math.round(benchmark * (1 + tol));
              const estimatedTotalAmount = Math.round(weight * quote);
              const tolerancePercent = Math.round(tol * 100);

              let isCleared = false;
              let status = 'PRE_CLEARED';
              let badgeText = 'PRE-CLEARED ✅';
              let position = 'IN_RANGE'; // 'IN_RANGE' | 'BELOW_RANGE' | 'ABOVE_RANGE'
              let diffPercent = 0;
              let message = '';

              if (quote < lowerLimit) {
                isCleared = false;
                status = 'NOT_CLEARED_BELOW';
                badgeText = 'NOT CLEARED ❌';
                position = 'BELOW_RANGE';
                diffPercent = lowerLimit > 0 ? Math.round(((lowerLimit - quote) / lowerLimit) * 100) : 0;
                message = `Quoted price (₹${quote}/${unit}) is BELOW the allowed fair range (₹${lowerLimit} – ₹${upperLimit}/${unit}) by ${diffPercent}%.`;
              } else if (quote > upperLimit) {
                isCleared = false;
                status = 'NOT_CLEARED_ABOVE';
                badgeText = 'NOT CLEARED ❌';
                position = 'ABOVE_RANGE';
                diffPercent = upperLimit > 0 ? Math.round(((quote - upperLimit) / upperLimit) * 100) : 0;
                message = `Quoted price (₹${quote}/${unit}) is ABOVE the allowed fair range (₹${lowerLimit} – ₹${upperLimit}/${unit}) by ${diffPercent}%.`;
              } else {
                isCleared = true;
                status = 'PRE_CLEARED';
                badgeText = 'PRE-CLEARED ✅';
                position = 'IN_RANGE';
                diffPercent = 0;
                message = `Quoted price (₹${quote}/${unit}) is within the allowed fair benchmark range (₹${lowerLimit} – ₹${upperLimit}/${unit}).`;
              }

              const result = {
                success: true,
                data: {
                  category: data.category || '',
                  material: data.material || '',
                  benchmarkRate: benchmark,
                  tolerancePercent,
                  allowedPriceRange: {
                    minPrice: lowerLimit,
                    maxPrice: upperLimit,
                    rangeLabel: `₹${lowerLimit} – ₹${upperLimit} / ${unit}`
                  },
                  quotedPrice: quote,
                  lotWeight: weight,
                  unit,
                  estimatedTotalAmount,
                  validation: {
                    isCleared,
                    status,
                    badgeText,
                    position,
                    diffPercent,
                    message,
                    explanation: isCleared 
                      ? `Quoted price of ₹${quote}/${unit} is fully compliant and pre-cleared without manual approval barriers.`
                      : position === 'BELOW_RANGE'
                        ? `Quoted price of ₹${quote}/${unit} is ${diffPercent}% below the minimum allowed limit (₹${lowerLimit}/${unit}).`
                        : `Quoted price of ₹${quote}/${unit} is ${diffPercent}% above the maximum allowed limit (₹${upperLimit}/${unit}).`
                  }
                }
              };

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Invalid payload' }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pricingApiPlugin()],
  optimizeDeps: {
    include: ['dexie']
  },
  server: {
    port: 3000,
    open: true
  }
})

