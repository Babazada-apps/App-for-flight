import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cors from "cors";

// Optional: Fallback password and secret for local testing
const APP_PASSWORD = process.env.APP_PASSWORD || "atlas123";
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key";

// In-memory data store for flights
let flights: any[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.use(cors());
  app.use(express.json());

  // Login endpoint
  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    
    if (password === APP_PASSWORD) {
      const token = jwt.sign({ authenticated: true }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token });
    } else {
      res.status(401).json({ error: "Yanlış şifrə!" });
    }
  });

  // Middleware to verify token for API routes
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Get all flights endpoint
  app.get("/api/flights", authenticateToken, (req, res) => {
    res.json(flights);
  });

  // Socket.IO authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) return next(new Error("Authentication error"));
      socket.data.user = decoded;
      next();
    });
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // When client asks for initial state
    socket.on("getFlights", (callback) => {
      callback(flights);
    });

    // When client sends new flight
    socket.on("addFlight", (flight) => {
      flights.push(flight);
      io.emit("flightsUpdated", flights);
    });

    // When client updates existing flight
    socket.on("updateFlight", (data) => {
      const { id, field, value, totalFlightTime, updatedAt } = data;
      flights = flights.map(f => {
        if (f.id === id) {
          return { 
            ...f, 
            [field]: value, 
            updatedAt,
            ...(totalFlightTime !== undefined ? { totalFlightTime } : {}) 
          };
        }
        return f;
      });
      io.emit("flightsUpdated", flights);
    });

    // When client deletes flight
    socket.on("deleteFlight", (id) => {
      flights = flights.filter(f => f.id !== id);
      io.emit("flightsUpdated", flights);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
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
    // Express 4 wildcard catch-all route
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
