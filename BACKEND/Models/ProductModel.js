const mongoose = require("mongoose");

// Counter Schema for auto-increment
const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", CounterSchema);

// Product Schema
const ProductSchema = new mongoose.Schema(
  {
    srNo: { type: Number, unique: true },
    challanNo: { type: String, unique: true },
    challanDate: { type: Date, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },
    itemName: { type: String, required: true },
    hsnCode: { type: String, unique: true },
    color: String,
    fabricType: String,
    pattern: String,
    width: String,
    gsm: Number,
    lotNo: { type: String, unique: true },
    unit: { type: String, required: true },
    grossQty: { type: Number, required: true },
    tareWeight: { type: Number, default: 0 },
    netQty: { type: Number },
    price: { type: Number, required: true },
    gst: { type: Number, required: true },
    totalAmount: Number,
    gstAmount: Number,
    finalAmount: Number,
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    isJobWork: { type: Boolean, default: false },
    jobWorkDetails: {
      partyName: String,
      jobWorkRate: Number,
      issueDate: Date,
      expectedReturnDate: Date,
      quantitySent: Number,
    },
    remarks: String,
  },
  { timestamps: true }
);

// Helper function to get 4-digit padded string
const pad4 = (num) => (num % 10000).toString().padStart(4, "0");

// Pre-save middleware
ProductSchema.pre("save", async function () {
  const doc = this;

  // 1️⃣ Auto-increment srNo using Counter collection
  let counter = await Counter.findOneAndUpdate(
    { name: "product" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  doc.srNo = counter.seq;

  // 2️⃣ Auto-generate challanNo with prefix 'CH' (4-digit)
  doc.challanNo = `CH${pad4(doc.srNo)}`;

  // 3️⃣ Auto-generate lotNo with prefix 'LOT' (4-digit)
  doc.lotNo = `LOT${pad4(doc.srNo)}`;

  // 4️⃣ Auto-generate HSN code with prefix 'HSN' (4-digit)
  if (!doc.hsnCode) {
    doc.hsnCode = `HSN-${pad4(doc.srNo)}`;
  }

  // 5️⃣ Auto-calculate netQty, totalAmount, gstAmount, finalAmount
  if (doc.grossQty && doc.tareWeight >= 0) doc.netQty = doc.grossQty - doc.tareWeight;
  if (doc.netQty && doc.price) doc.totalAmount = doc.netQty * doc.price;
  if (doc.totalAmount && doc.gst >= 0) doc.gstAmount = (doc.totalAmount * doc.gst) / 100;
  if (doc.totalAmount && doc.gstAmount >= 0) doc.finalAmount = doc.totalAmount + doc.gstAmount;
});

const ProductModel = mongoose.model("Products", ProductSchema);
module.exports = ProductModel;
