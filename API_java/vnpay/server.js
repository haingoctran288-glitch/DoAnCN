import express from "express";
import cors from "cors";
import "dotenv/config";
import { VNPay } from "vnpay";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMN_CODE,
  secureSecret: process.env.VNP_HASH_SECRET,
  testMode: true,
});

// POST endpoint to create payment URL with dynamic amount
app.post("/create-payment", (req, res) => {
  const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "127.0.0.1";

  // Get amount from request body (Already in VND)
  const amountVND = req.body.amount || 10000;

  const orderInfo = req.body.orderInfo || "Thanh toan don hang Didong";
  const orderId = req.body.orderId || Date.now();

  try {
    const vnpUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amountVND,
      vnp_IpAddr: ipAddr,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_ReturnUrl: `http://localhost:8081/vnpay-result`,
    });

    console.log("✅ Payment URL created:", vnpUrl);
    console.log("   Amount (VND):", amountVND);
    console.log("   Order ID:", orderId);

    res.json({
      success: true,
      url: vnpUrl,
      amountVND: amountVND,
      orderId: orderId
    });
  } catch (error) {
    console.error("Error creating payment URL:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Legacy GET endpoint (for backward compatibility)
app.get("/payment", (req, res) => {
  const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const amount = parseInt(req.query.amount) || 1000000;

  const vnpUrl = vnpay.buildPaymentUrl({
    vnp_Amount: amount,
    vnp_IpAddr: ipAddr,
    vnp_TxnRef: Date.now(),
    vnp_OrderInfo: "Thanh toan don hang DEMO",
    vnp_ReturnUrl: `http://localhost:8081/vnpay-result`,
  });

  console.log("✅ Payment URL:", vnpUrl);
  res.json({ url: vnpUrl });
});

// IPN Callback from VNPay
app.get("/vnpay-ipn", (req, res) => {
  const query = req.query;
  const verify = vnpay.verifyReturnUrl(query);

  console.log("VNPay IPN callback:", query);

  if (verify && query.vnp_ResponseCode === "00") {
    res.json({ RspCode: "00", Message: "Success" });
  } else {
    res.json({ RspCode: "97", Message: "Invalid checksum" });
  }
});

// Return URL handler
app.get("/", (req, res) => {
  const query = req.query;
  const verify = vnpay.verifyReturnUrl(query);

  console.log("VNPay return query:", query);

  if (verify && query.vnp_ResponseCode === "00") {
    res.send("Thanh toán thành công!");
  } else {
    res.send("Thanh toán thất bại!");
  }
});

app.listen(PORT, () => {
  console.log(`VNPay server running on http://localhost:${PORT}`);
  console.log("Endpoints:");
  console.log("  POST /create-payment - Create payment with dynamic amount");
  console.log("  GET /payment?amount=XXX - Legacy payment endpoint");
});
