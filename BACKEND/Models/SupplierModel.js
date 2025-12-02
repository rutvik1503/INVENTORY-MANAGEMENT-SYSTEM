const mongoose = require('mongoose')

// 📌 Supplier Schema — Stores vendor / party details for product purchasing
const supplierSchema = new mongoose.Schema(
  {
    // 🔹 Supplier / Party Name
    name: { 
      type: String, 
      required: true 
    },

    // 🔹 Contact Details
    mobile: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String 
    },
    address: { 
      type: String 
    },

    // 🔹 Business Details
    gstNumber: { 
      type: String 
    },
    companyName: { 
      type: String 
    },
  },
  {
    timestamps: true, // Auto-generate createdAt & updatedAt
  }
);

// 📌 Create collection (suppliers)
const SupplierModel = mongoose.model("suppliers", supplierSchema);

module.exports = SupplierModel;
