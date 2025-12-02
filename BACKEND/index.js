const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const CategoryModel = require('./Models/CategoryModel')
const SubCategoryModel = require('./Models/SubCategoryModel')
const SupplierModel = require('./Models/SupplierModel')
const ProductModel = require('./Models/ProductModel')

const app = express();

app.use(express.json());
app.use(cors());

const superEmail = "super.admin@gmail.com";
const superPassword = "Super@123";

mongoose.connect("mongodb+srv://rutvikSuperAdmin:Super%2EDB%401503@inventorydb.i7cf8tp.mongodb.net/InventoryDataBase")

// Log in request
app.post("/logIn", async (req, res) => {
  const { email, password } = req.body;

  if (email === superEmail && password === superPassword) {

    const token = jwt.sign({id : "123"}, "1503", {expiresIn : "1d"})

    res.json({ message: "Super Admin Logged In...", superToken : token });
  } else if (email !== superEmail) {
    res.json({ message: "Incorrect Email !" });
  } else {
    res.json({ message: "Incorrect Password !" });
  }
});

// Add Category
app.post("/addCategory", async (req, res) => {
  const { categoryName } = req.body;

  const newCategory = await CategoryModel.create({ name: categoryName });

  res.json({ message: "Category Added !", categoryId: newCategory._id });
});

// ADD sub category
app.post("/addSubCategory", async (req, res) => {
  const { categoryId, subCategories } = req.body;

  const docs = subCategories.map((name) => ({
    name,
    category: categoryId,
  }));

  await SubCategoryModel.insertMany(docs);

  res.json({ message: "Sub Categories Added Successfully" });
});

// Add Supplier
app.post("/addSupplier", async (req, res) => {
  try {
    const supplier = new SupplierModel(req.body);
    await supplier.save();
    res.status(201).json({ message: "Supplier added successfully", supplierId: supplier._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding supplier", error: err.message });
  }
});

// Add Product
app.post("/addProduct", async (req, res) => {
  try {
    const product = new ProductModel(req.body);
    await product.save();
    res.status(201).json({ message: "Product added successfully", productId: product._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding product", error: err.message });
  }
});

// Get Categories
app.get("/getCategories", async (req, res) => {
  const categories = await CategoryModel.find({});
  res.json(categories);
});

// Get SubCategories by Category
app.get("/getSubCategories/:categoryId", async (req, res) => {
  const subCategories = await SubCategoryModel.find({ category: req.params.categoryId });
  res.json(subCategories);
});

// Get Suppliers
app.get("/getSuppliers", async (req, res) => {
  const suppliers = await SupplierModel.find({});
  res.json(suppliers);
});

// Get all Product
app.get("/getAllProduct", async (req, res) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
  }
});

// Update product by id
app.put("/updateProduct/:id", async (req, res) => {
  try {
    const updated = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: "Product updated", updated });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete product
app.delete("/deleteProduct/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// GET product by ID
app.get("/getProductById/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(8080, () => {
  console.log("Server is runnig !");
});
