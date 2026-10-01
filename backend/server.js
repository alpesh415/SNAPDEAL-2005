require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { seedIfEmpty } = require("./utils/seedData");
const errorMiddleware = require("./middleware/errorMiddleware");
const validateIds = require("./middleware/validateIds");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// HOME / ROOT ROUTE
app.get("/", (req, res) => {
    res.send("SnepDeal E-Commerce Backend is Running");
});

// API ROUTES
app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/cart", validateIds, cartRoutes);
app.use("/wishlist", validateIds, wishlistRoutes);
app.use("/order", validateIds, orderRoutes);
app.use("/payment", validateIds, paymentRoutes);

// Unknown route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 8095;

const start = async () => {

    try {

        // Server starts only after MongoDB is connected, so data is always saved.
        await connectDB();

        if (process.env.AUTO_SEED !== "false") {
            await seedIfEmpty();
        }

        app.listen(PORT, () => {
            console.log("server is started on port " + PORT);
        });

    } catch (error) {

        console.error("Could not start server:", error.message);

        const msg = String(error.message || "").toLowerCase();

        if (msg.includes("bad auth") || msg.includes("authentication failed")) {
            console.error(
                "\nMongoDB ne username/password reject kiya.\n" +
                "1) Atlas > Database Access mein user ka password reset karo (sirf letters/numbers).\n" +
                "2) backend/.env ki MONGO_URI mein wahi user aur password daalo.\n" +
                "3) Test karne ke liye chalao:  node check-db.js"
            );
        } else if (msg.includes("econnrefused") || msg.includes("timed out") || msg.includes("server selection")) {
            console.error(
                "\nMongoDB se connect nahi ho paya - MongoDB service chalu nahi hai.\n" +
                "1) MongoDB Community Server install karo: https://www.mongodb.com/try/download/community\n" +
                "   (installer mein 'Install MongoDB as a Service' tick rakho)\n" +
                "2) Windows: Win + R > services.msc > 'MongoDB Server' > Start\n" +
                "3) Phir dobara chalao. Test: node check-db.js"
            );
        } else {
            console.error("Check MONGO_URI in backend/.env, then run:  node check-db.js");
        }

        process.exit(1);

    }

};

start();
