import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
import crypto from "crypto";
import admin from "firebase-admin";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const firebaseConfig = JSON.parse(readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));
const app = getApps().length === 0 
  ? initializeApp({ projectId: firebaseConfig.projectId }) 
  : getApps()[0];

const adminDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Razorpay Initialization
  const razorpay = new Razorpay({
    key_id: process.env.VITE_RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
  });

  if (!process.env.VITE_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn("CRITICAL: Razorpay keys missing. Payment nodes will be inactive.");
  }

  // Middleware
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", version: "1.2.0" });
  });

  // Razorpay: Create Order
  app.post("/api/razorpay/order", async (req, res) => {
    try {
      const { amount, currency = "INR", receipt = "receipt_" + Date.now() } = req.body;
      
      const options = {
        amount: amount * 100, // Amount in smallest currency unit (paise)
        currency,
        receipt,
      };

      const order = await razorpay.orders.create(options);
      res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
    } catch (error) {
      console.error("Razorpay Order Error:", error);
      res.status(500).json({ error: "Failed to create Razorpay order" });
    }
  });

  // Razorpay: Verify Payment
  app.post("/api/razorpay/verify", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ status: "failure", message: "User ID required for neural linking" });
      }

      const secret = process.env.RAZORPAY_KEY_SECRET || "";

      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const generated_signature = hmac.digest("hex");

      if (generated_signature === razorpay_signature) {
        // SECURE ELEVATION: Grant elite status via Admin SDK
        await adminDb.collection("users").doc(userId).set({
          isElite: true,
          eliteActivatedAt: FieldValue.serverTimestamp()
        }, { merge: true });

        res.json({ status: "success", message: "Payment verified. Elite access granted." });
      } else {
        res.status(400).json({ status: "failure", message: "Invalid signature" });
      }
    } catch (error) {
      console.error("Razorpay Verification Error:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
