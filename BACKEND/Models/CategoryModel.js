const mongoose = require('mongoose')

// 📌 Category Schema — Used to store main category list (e.g., Fabric, Yarn, Accessories)
const categorySchema = new mongoose.Schema(
  {
    // 🔹 Category Name (must be unique)
    name: { 
      type: String, 
      required: true,  // Cannot be empty
      unique: true     // Prevent duplicate category names
    },
  },
  {
    timestamps: true, // Auto add createdAt & updatedAt fields
  }
);

// 📌 Creating Collection (categories)
const CategoryModel = mongoose.model("categories", categorySchema);

module.exports = CategoryModel;
