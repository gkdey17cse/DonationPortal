Yes — you can absolutely build this **entire project for ₹0** if you stick to free-tier tools.
Since you want **EJS for frontend**, **Node.js for backend**, and **MongoDB** — it’s straightforward and free to deploy.

Here’s how you can do it fully free:

---

## **Free Tech Stack Plan**

| Component                       | Free Service                                                                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend (EJS)**              | Served directly from Node.js (Express)                                                                                                                                         |
| **Backend (Node.js + Express)** | [Render](https://render.com/) / [Railway](https://railway.app/) free tier                                                                                                      |
| **Database**                    | [MongoDB Atlas](https://www.mongodb.com/atlas/database) free tier (500MB)                                                                                                      |
| **Payment Gateway**             | [Razorpay Test Mode](https://razorpay.com/docs/payments/payments/test-card-upi-details/) free for testing; for production, you’ll need verified account (still free to set up) |
| **PDF Generation**              | PDFKit (npm) — runs locally and in deployment                                                                                                                                  |
| **Deployment**                  | Backend: Render free tier, Database: MongoDB Atlas free tier                                                                                                                   |
| **Domain (optional)**           | Use free Render/Railway subdomain, or get free `.me` from Freenom                                                                                                              |

---

## **Implementation Flow**

### **1️⃣ Project Structure**

```
project/
│
├── views/                # EJS templates
│   ├── index.ejs          # Payment form
│   ├── offline.ejs        # Offline form
│   ├── admin.ejs          # Table view
│
├── public/               # Static CSS/JS
├── routes/               # Express route files
├── models/               # Mongoose models
├── app.js                # Main server file
├── package.json
└── .env                  # Environment variables
```

---

### **2️⃣ Features to Build**

1. **Payment Page** (online)

   * EJS form → POST to `/create-order` → Razorpay checkout → success → store in DB.
2. **Offline Entry Page**

   * EJS form → POST to `/offline-entry` → store in DB → generate PDF → show download link.
3. **Admin Page**

   * Fetch all records from DB.
   * Search/filter by name, email, mobile, amount, address.
   * Link to PDF receipts.

---

### **3️⃣ MongoDB Atlas Setup**

* Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
* Create free cluster.
* Create database `donations` and collection `payments`.
* Get connection string → put in `.env`:

  ```
  MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/donations
  RAZORPAY_KEY_ID=your_key
  RAZORPAY_KEY_SECRET=your_secret
  PORT=5000
  ```

---

### **4️⃣ Free Deployment**

#### **Backend + Frontend (together)**

* Push code to GitHub.
* Connect GitHub repo to [Render](https://render.com/) or [Railway](https://railway.app/).
* Set environment variables in their dashboard.
* Free tier will give you a public link like:

  ```
  https://my-donation-app.onrender.com
  ```
* EJS pages will be served directly from Express.

#### **Database**

* MongoDB Atlas stays online 24×7, free.

---

### **5️⃣ Cost & Limitations**

* **Zero cost** if you stay in free tier:

  * Render free tier → 750 hours/month (can run 24×7).
  * MongoDB Atlas free → 500MB storage.
* Limitations:

  * Render free tier sleeps after inactivity (wakes up on first visit).
  * Razorpay live mode requires you to complete KYC (still free).

---

✅ **Conclusion:**
Yes — you can make this whole project **fully free**, deploy it online, and let anyone on the internet access it without paying a rupee.

If you want, I can **write you a minimal Node.js + EJS + Mongo + Razorpay skeleton app** that works locally and can be deployed to Render without changes.
That way, you just fill in the UI details and database queries.

Do you want me to prepare that starter project?
