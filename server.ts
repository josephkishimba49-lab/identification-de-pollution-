import express from "express";
import { createServer as createViteServer } from "vite";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Simulate sensor data
  app.get("/api/markers/live", (req, res) => {
    // Return some simulated real-time data
    const simulatedMarkers = [
        { name: 'Chromium', symbol: 'Cr', concentration: Math.random() * 10, unit: 'mg/L', category: 'chemical' },
        { name: 'Chlorides', symbol: 'Cl', concentration: Math.random() * 50, unit: 'mg/L', category: 'chemical' },
        { name: 'Cadmium', symbol: 'Cd', concentration: Math.random() * 2, unit: 'mg/L', category: 'chemical' },
        { name: 'Lead', symbol: 'Pb', concentration: Math.random() * 5, unit: 'mg/L', category: 'chemical' },
        { name: 'Zinc', symbol: 'Zn', concentration: Math.random() * 20, unit: 'mg/L', category: 'chemical' },
    ];
    res.json({ markers: simulatedMarkers });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
     const distPath = path.join(process.cwd(), 'dist');
     app.use(express.static(distPath));
     app.get('*', (req, res) => {
       res.sendFile(path.join(distPath, 'index.html'));
     });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
