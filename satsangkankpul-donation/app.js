// require("dotenv").config();
// const express = require("express");
// const path = require("path");
// const mongoose = require("mongoose");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// const app = express();

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));

// // Set EJS
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("✅ MongoDB Connected"))
//     .catch(err => console.error("❌ MongoDB Connection Error:", err));

// // Schema & Model (force collection: 'Users')
// const donationSchema = new mongoose.Schema({
//     fullName: String,
//     address: String,
//     mobile: String,
//     email: String,
//     amountINR: Number,
//     comment: String,
//     paymentMethod: String, // "online" or "offline"
//     date: { type: Date, default: Date.now }
// }, { collection: 'Users' });

// const Donation = mongoose.model("UserDonation", donationSchema);

// // Routes
// app.get("/", (req, res) => res.render("online"));
// app.get("/offline", (req, res) => res.render("offline"));

// app.get("/admin", async (req, res) => {
//     try {
//         const donations = await Donation.find().sort({ date: -1 });
//         res.render("admin", { donations });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error fetching data");
//     }
// });

// app.get("/receipt/:id", async (req, res) => {
//     try {
//         const donation = await Donation.findById(req.params.id);
//         if (!donation) return res.status(404).send("Donation not found");
//         res.render("receipt", { donation });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error generating receipt");
//     }
// });

// app.get("/success", async (req, res) => {
//     try {
//         const { id } = req.query;          // /success?id=<donationId>
//         if (!id) return res.render("success", { donation: null });

//         const donation = await Donation.findById(id);
//         if (!donation) return res.render("success", { donation: null });

//         res.render("success", { donation });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error loading success page");
//     }
// });


// // Handle offline form submission
// app.post("/offline", async (req, res) => {
//     try {
//         const { fullName, address, mobile, email, amountINR, comment } = req.body;
//         const newDonation = new Donation({
//             fullName,
//             address,
//             mobile,
//             email,
//             amountINR,
//             comment,
//             paymentMethod: "offline"
//         });
//         await newDonation.save();
//         res.redirect(`/success?id=${newDonation._id}`);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error saving data");
//     }
// });

// // Razorpay instance
// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// // Route to create Razorpay order
// app.post("/pay", async (req, res) => {
//     const { fullName, address, mobile, email, amountINR, comment } = req.body;

//     try {
//         const options = {
//             amount: amountINR * 100, // Razorpay works in paise
//             currency: "INR",
//             receipt: `receipt_order_${Date.now()}`
//         };

//         const order = await razorpay.orders.create(options);

//         // Pass order + form data to checkout page
//         res.render("checkout", {
//             key_id: process.env.RAZORPAY_KEY_ID,
//             order_id: order.id,
//             amountINR,
//             fullName,
//             address,
//             mobile,
//             email,
//             comment
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error creating Razorpay order");
//     }
// });

// // Route to handle Razorpay success
// app.post("/payment-success", async (req, res) => {
//     const {
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature,
//         fullName,
//         address,
//         mobile,
//         email,
//         amountINR,
//         comment
//     } = req.body;

//     // Verify Razorpay signature
//     const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
//     hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
//     const generatedSignature = hmac.digest("hex");

//     if (generatedSignature === razorpay_signature) {
//         // Save successful payment to DB
//         const newDonation = new Donation({
//             fullName,
//             address,
//             mobile,
//             email,
//             amountINR,
//             comment,
//             paymentMethod: "online"
//         });
//         await newDonation.save();

//         res.redirect(`/success?id=${newDonation._id}`);
//     } else {
//         res.status(400).send("Payment verification failed");
//     }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: process.env.SESSION_SECRET || "changeme",
    resave: false,
    saveUninitialized: true
}));

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ================== SCHEMAS ==================

// Donations in "Donars" collection
const donationSchema = new mongoose.Schema({
    fullName: String,
    address: String,
    mobile: String,
    email: String,
    amountINR: Number,
    comment: String,
    paymentMethod: String, // "online" or "offline"
    date: { type: Date, default: Date.now }
}, { collection: 'Donars' });

const Donation = mongoose.model("Donation", donationSchema);

// Users in "Users" collection
const userSchema = new mongoose.Schema({
    username: String,
    password: String // hashed
}, { collection: 'Users' });

const User = mongoose.model("User", userSchema);

// ================== AUTH MIDDLEWARE ==================
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    next();
}

// ================== ROUTES ==================
app.get("/", (req, res) => res.render("online"));
app.get("/offline", (req, res) => res.render("offline"));

// Admin (protected)
app.get("/admin", requireLogin, async (req, res) => {
    try {
        const donations = await Donation.find().sort({ date: -1 });
        res.render("admin", { donations });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
    }
});

// Signup
app.get("/signup", (req, res) => res.render("signup"));
app.post("/signup", async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.send("Passwords do not match");
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashed });
    await newUser.save();
    res.redirect("/login");
});


// Login
app.get("/login", (req, res) => res.render("login"));
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.send("User not found");
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("Invalid credentials");
    req.session.userId = user._id;
    res.redirect("/admin");
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

// Receipt
app.get("/receipt/:id", async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) return res.status(404).send("Donation not found");
        res.render("receipt", { donation });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating receipt");
    }
});

// Success
app.get("/success", async (req, res) => {
    try {
        const { id } = req.query; // /success?id=<donationId>
        if (!id) return res.render("success", { donation: null });

        const donation = await Donation.findById(id);
        if (!donation) return res.render("success", { donation: null });

        res.render("success", { donation });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading success page");
    }
});

// Handle offline form submission
app.post("/offline", async (req, res) => {
    try {
        const { fullName, address, mobile, email, amountINR, comment } = req.body;
        const newDonation = new Donation({
            fullName,
            address,
            mobile,
            email,
            amountINR,
            comment,
            paymentMethod: "offline"
        });
        await newDonation.save();
        res.redirect(`/success?id=${newDonation._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving data");
    }
});

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Route to create Razorpay order
app.post("/pay", async (req, res) => {
    const { fullName, address, mobile, email, amountINR, comment } = req.body;

    try {
        const options = {
            amount: amountINR * 100, // Razorpay works in paise
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.render("checkout", {
            key_id: process.env.RAZORPAY_KEY_ID,
            order_id: order.id,
            amountINR,
            fullName,
            address,
            mobile,
            email,
            comment
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating Razorpay order");
    }
});

// Handle Razorpay success
app.post("/payment-success", async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        fullName,
        address,
        mobile,
        email,
        amountINR,
        comment
    } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
        const newDonation = new Donation({
            fullName,
            address,
            mobile,
            email,
            amountINR,
            comment,
            paymentMethod: "online"
        });
        await newDonation.save();

        res.redirect(`/success?id=${newDonation._id}`);
    } else {
        res.status(400).send("Payment verification failed");
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
