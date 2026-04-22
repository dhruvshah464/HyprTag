import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Razorpay Initialization
  const razorpay = new Razorpay({
    key_id: process.env.VITE_RAZORPAY_KEY_ID || "rzp_test_Sg6fYCNTFZtjgp",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "z6Vw4xTRq7JB9UcPdGfukTni",
  });

  // Middleware
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", version: "1.0.0" });
  });

  // Auth: Mock Send Verification Email
  app.post("/api/auth/send-code", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });
      
      const code = "HYPR-" + Math.floor(1000 + Math.random() * 9000);
      
      console.log(`[STRATEGIC_PROTOCOL] Sending verification code ${code} to ${email}`);
      // In a real Billion Dollar SaaS, we'd use SendGrid/Nodemailer here.
      
      res.json({ 
        status: "success", 
        message: "Neural verification packet dispatched.", 
        debugCode: code // Provided for demo purposes
      });
    } catch (error) {
      console.error("Auth Error:", error);
      res.status(500).json({ error: "Failed to dispatch verification packet." });
    }
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
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const secret = process.env.RAZORPAY_KEY_SECRET || "z6Vw4xTRq7JB9UcPdGfukTni";

      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const generated_signature = hmac.digest("hex");

      if (generated_signature === razorpay_signature) {
        res.json({ status: "success", message: "Payment verified successfully" });
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
