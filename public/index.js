import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import User from "./models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Item from "./models/Item.js";
import multer from "multer";
import axios from "axios";
import Cart from "./models/Cart.js";
import mongoose from "mongoose";
import Order from "./models/Order.js";
import Loyalty from "./models/Loyalty.js";
import compression from "compression";


const app = express();
app.use(compression()); // Enable Gzip compression


const JWT_SECRET = "absdjsjdsks"; // Strong secret key\
const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;
const GOOGLE_CLIENT_ID =
  "605946983160-vf0d2e27pj7601kv82b91ut7m6mlk8t3.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

app.use(
  cors({
    origin: "https://bakery-ez.com", // Allow requests from this origin
    credentials: true,
  })
);

app.use(json());
app.use(
  session({
    secret: "sdssf",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// GOOGLE AUTH
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "https://api.bakery-ez.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            authType: "google",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

const dbPassword = "lsMZn83HM0dRtXpr";
const dbName = "mongodb+srv://bakery-easy:";
const dbLink =
  "@cluster0.t8k51.mongodb.net/userdb?retryWrites=true&w=majority&appName=Cluster0";
const dbConnection = dbName + dbPassword + dbLink;

connect(dbConnection)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
// Routes
// Google Authentication
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    if (req.user) {
      const token = jwt.sign({ id: req.user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.redirect(
        `http://bakery-ez.com/?token=${token}&name=${req.user.name}&id=${req.user.id}`
      );
    } else {
      res.redirect("/login");
    }
  }
);

// Register
app.post("/Register", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ ...req.body, password: hashedPassword });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password, captchaToken } = req.body;

  // Verify reCAPTCHA token
  const secretKey = "6LfYpdkqAAAAABcgn45GKJLrALGE53_rFqYxzg5D"; // Replace with your secret key
  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify`,
    null,
    {
      params: {
        secret: secretKey,
        response: captchaToken,
      },
    }
  );

  const { success } = response.data;
  if (!success) {
    return res.status(400).json({ error: "CAPTCHA verification failed" });
  }

  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      return res.json({
        token,
        user: { name: user.name, email: user.email, _id: user._id },
      });
    }
    res.status(400).json("Invalid email or password");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Token Verification
app.post("/verifyToken", (req, res) => {
  const token = req.body.token;
  if (!token) return res.status(400).json({ message: "Token is required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ valid: true, decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: "Invalid or expired token" });
  }
});

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../../client/frontend/public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Authenticate Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, "SECRET_KEY", (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
};

// Routes

// Update User Profile
app.put(
  "/users/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const updateData = {
        name: req.body.name,
        email: req.body.email,
        ...(req.file && { image: `public/uploads/${req.file.filename}` }),
        ...(req.body.googleId && { googleId: req.body.googleId }), // Allow updating googleId
      };

      const user = await User.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json(user);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating user profile", error: err.message });
    }
  }
);

app.get("/users/:id", authenticateToken, async (req, res) => {
  const userId = req.params.id;
  console.log("Received userId:", userId); // Add this log to check the value
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Get Items

// Get Items by Category
app.get("/items", async (req, res) => {
  try {
    const category = req.query.category; // Get category from query params
    const query = category ? { category } : {}; // If category is provided, filter by it
    const items = await Item.find(query);
    res.status(200).json({ data: items });
  } catch (error) {
    res.status(500).json({ message: "Error fetching items" });
  }
});

// Assuming this is in a file where you're setting up routes with Express
// Add item to cart (handles duplicate items)
// Add item to cart (handles duplicate items)
app.post("/carts", async (req, res) => {
  const { title, description, price, category, image, userId, itemType } =
    req.body;

  // Input validation
  if (!title || !price || !userId) {
    return res
      .status(400)
      .json({ message: "Title, price, and userId are required." });
  }

  try {
    // Check if the item already exists in the cart for this user
    const existingCart = await Cart.findOne({ title, userId });

    if (existingCart) {
      // If item exists, update the quantity
      existingCart.quantity = (existingCart.quantity || 1) + 1;
      const updatedCart = await existingCart.save();
      return res.status(200).json(updatedCart); // Return updated item
    }

    // If item does not exist, create a new cart item
    const newCart = new Cart({
      title,
      description,
      price,
      category,
      image,
      userId,
      quantity: 1,
      itemType, // Initialize quantity as 1 for new items
    });

    const savedCart = await newCart.save();
    res.status(201).json(savedCart); // Return newly added item
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res
      .status(500)
      .json({ message: "Failed to add item to cart", error: error.message });
  }
});

// POST route to handle image saving and data
// Routes
app.post("/customcarts", upload.single("image"), async (req, res) => {
  try {
    const {
      userId,
      price,
      flavor,
      fillings,
      frosting,
      title,
      category,
      image,
    } = req.body;
    const imagePath = req.file ? req.file.path : null; // Path to the uploaded image
    if (!userId || !price || !imagePath) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const newCart = new Cart({
      userId,
      price,
      title,
      flavor,
      fillings,
      frosting,
      category,
      imagePath,
      image,
    });

    await newCart.save();
    res
      .status(201)
      .json({ message: "Custom cake added to cart", item: newCart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Serve images statically
app.use("public/uploads", express.static("uploads"));

// Get all cart items for a specific user
app.get("/carts/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await Cart.find({ userId });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

// Node.js Express route to clear all cart items for a user
app.delete("/carts/clear/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    await Cart.deleteMany({ userId }); // Adjust the model name as per your schema
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
});

// Delete a specific cart item by ID
app.delete("/carts/item/:itemId", async (req, res) => {
  const { itemId } = req.params;

  try {
    const deletedItem = await Cart.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    res.status(200).json({ message: "Item successfully deleted from cart" });
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    res.status(500).json({ error: "Failed to delete item from cart" });
  }
});

// Cart Operations
app.post("/carts", authenticateToken, async (req, res) => {
  const { title, description, price, category, image, userId, itemType } =
    req.body;
  if (!title || !price || !userId) {
    return res
      .status(400)
      .json({ message: "Title, price, and userId are required." });
  }
  try {
    const newCart = new Cart({
      title,
      description,
      price,
      category,
      image,
      userId,
      itemType,
    });
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add item to cart", error: error.message });
  }
});

// API endpoint to add to cart
app.post("/carts", async (req, res) => {
  try {
    console.log("Received data:", req.body); // Log the received data

    const { userId, title, description, price, category, image } = req.body;

    // Basic validation (add more as needed)
    if (!userId || !title || !description || !price || !category || !image) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (typeof price !== "number") {
      return res.status(400).json({ error: "Price must be a number" });
    }

    const customCart = new CustomCart({
      userId,
      title,
      description,
      price,
      category,
      image,
    });

    await customCart.save();
    res.status(201).json({ message: "Cake added to cart!" });
  } catch (error) {
    console.error("Failed to add to cart:", error);
    res.status(500).json({ error: "Failed to add cake to cart" });
  }
});

//CashOrder

app.post("/save-order", async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      totalAmount,
      pickupDateTime,
      quantity,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).send({ message: "User ID is required." });
    }

    // Fetch the user's details using the userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Extract the name and email from the user document
    const { name: userName, email: userEmail } = user;

    const newOrder = new Order({
      userId, // Ensure userId is set
      userName,
      userEmail,
      cartItems,
      totalAmount,
      pickupDateTime,
      paymentMethod,
      quantity,
    });

    await newOrder.save();
    res.status(201).send({ message: "Order saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to save order" });
  }
});

// Get Items by Category

// ... other routes ...
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    console.log(orders); // Debug log
    res.json({ data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

app.get("/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch orders based on userId
    const orders = await Order.find({ userId });

    console.log("Orders for userId:", userId, orders);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

app.put("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const newStatus = req.body.status;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status" });
  }
});

app.delete("/clear-cart/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Delete all cart items for the given userId
    const result = await Cart.deleteMany({ userId });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No cart items found for this user!" });
    }

    res.status(200).json({ message: "Cart cleared successfully!" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Error clearing cart", error });
  }
});

// Increase quantity of a cart item
app.put("/carts/item/:itemId/increase", async (req, res) => {
  const { itemId } = req.params;

  try {
    const updatedItem = await Cart.findByIdAndUpdate(
      itemId,
      { $inc: { quantity: 1 } }, // Increment quantity by 1
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error("Error increasing quantity:", error);
    res.status(500).json({ error: "Failed to increase quantity" });
  }
});

// Decrease quantity of a cart item
app.put("/carts/item/:itemId/decrease", async (req, res) => {
  const { itemId } = req.params;

  try {
    const updatedItem = await Cart.findByIdAndUpdate(
      itemId,
      { $inc: { quantity: -1 } }, // Decrement quantity by 1
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // If quantity becomes 0, remove the item from the cart
    if (updatedItem.quantity === 0) {
      await Cart.findByIdAndDelete(itemId);
    }

    res.json(updatedItem);
  } catch (error) {
    console.error("Error decreasing quantity:", error);
    res.status(500).json({ error: "Failed to decrease quantity" });
  }
});

//PAYMENT server.js
// server.js or a dedicated payment controller file
import fetch from "node-fetch"; // Ensure fetch is available if needed


const createPaymentLink = async (amount, description, remarks, orderId) => {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization:
        "Basic c2tfdGVzdF9zb2FqZFBrbUZFVEZ3d3FzRkV6cmdad2s6YmFrZXJ5",
    },
    body: JSON.stringify({
      data: {
        attributes: {
          amount,
          payment_method_allowed: ["gcash"], // Only GCash is allowed
          currency: "PHP",
          capture_type: "automatic",
          description,
          statement_descriptor: remarks,
          metadata: { order_id: orderId }, // Attach order ID as metadata
          redirect: {
            success: "http://bakery.bakery-ez.com/cart?status=success", // Redirect here after successful payment
            failed: "http://bakery.bakery-ez.comcart?status=failed", // Redirect here if payment fails
          },
        },
      },
    }),
  };

  try {
    const response = await fetch("https://api.paymongo.com/v1/links", options);
    const data = await response.json();

    if (data.errors) {
      console.error("PayMongo error:", data.errors);
      return null;
    }

    return data.data ? data.data.attributes.checkout_url : null;
  } catch (error) {
    console.error("Error creating payment link:", error);
    return null;
  }
};

app.post("/create-payment-link", async (req, res) => {
  const {
    userId,
    cartItems,
    totalAmount,
    pickupDateTime,
    paymentMethod,
    quantity,
    remarks,
  } = req.body;

  if (!totalAmount) {
    return res.status(400).json({ error: "Total amount is required." });
  }

  const amountInCents = Math.round(totalAmount * 100); // Convert PHP to cents
  const description = `Order for user: ${userId}`;

  try {
    const checkoutUrl = await createPaymentLink(
      amountInCents,
      description,
      remarks
    );

    if (!checkoutUrl) {
      return res.status(500).json({ error: "Failed to create payment link" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newOrder = new Order({
      userId,
      userName: user.name,
      userEmail: user.email,
      cartItems,
      totalAmount,
      pickupDateTime,
      paymentMethod,
      quantity,
      paymentLink: checkoutUrl,
      status: "Pending",
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      orderId: newOrder._id,
      checkoutUrl,
    });
  } catch (error) {
    console.error("Error creating order with payment link:", error);
    res
      .status(500)
      .json({ message: "Failed to create order with payment link" });
  }
});

app.post("/webhooks/paymongo", async (req, res) => {
  const webhookData = req.body;

  try {
    const eventType = webhookData.data.attributes.type;
    const paymentIntent = webhookData.data.attributes.data;

    if (eventType === "payment_intent.succeeded") {
      const orderId = paymentIntent.attributes.metadata.order_id; // Store `order_id` in PayMongo metadata when creating payment

      // Update the order's status to "paid"
      await Order.findByIdAndUpdate(orderId, { status: "paid" });

      console.log(`Order ${orderId} marked as paid`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).json({ success: false });
  }
});

// Route to fetch loyalty progress
// Fetch loyalty details for a user
app.get("/loyalty/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user's loyalty record by userId
    const userLoyalty = await Loyalty.findOne({ userId });

    if (!userLoyalty) {
      return res.status(404).json({ message: "Loyalty record not found" });
    }

    // Respond with orderCount and status
    res.json({
      orderCount: userLoyalty.orderCount,
      status: userLoyalty.status, // Include status in the response
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch loyalty details",
      error: error.message,
    });
  }
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
