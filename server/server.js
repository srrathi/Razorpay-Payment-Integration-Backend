const express = require("express");
const path = require("path");
const shortid = require("shortid");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/logo.svg", (req, res) => {
  res.sendFile(path.join(__dirname, "../logo.svg"));
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/verification", (req, res) => {
  const SECRET = "12345678";
  const crypto = require("crypto");

  const shasum = crypto.createHmac("sha256", SECRET);
  shasum.update(JSON.stringify(req.body));

  const digest = shasum.digest("hex");
  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    //process request
    require("fs").appendFileSync(
      "payments.json",
      JSON.stringify(req.body, null, 4)
    );
  } else {
    res.status(501);
  }

  res.json({ status: "ok" });
});

app.post("/razorpay", async (req, res) => {
  const payment_capture = 1;
  const amount = 500;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency: currency,
    receipt: shortid.generate(),
    payment_capture: payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Backend Server listening on ${PORT}`);
});
