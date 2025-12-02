import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

const AddProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const existingProduct = location.state || null; // For editing

  // Dropdown Data
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Selected IDs
  const [categoryId, setCategoryId] = useState(existingProduct?.category || "");
  const [subCategoryId, setSubCategoryId] = useState(
    existingProduct?.subCategory || ""
  );
  const [supplierId, setSupplierId] = useState(existingProduct?.supplier || "");

  // Product Details
  const [productData, setProductData] = useState({
    challanDate: existingProduct?.challanDate || "",
    itemName: existingProduct?.itemName || "",
    hsnCode: existingProduct?.hsnCode || "",
    color: existingProduct?.color || "",
    fabricType: existingProduct?.fabricType || "",
    pattern: existingProduct?.pattern || "",
    width: existingProduct?.width || "",
    gsm: existingProduct?.gsm || "",
    unit: existingProduct?.unit || "",
    grossQty: existingProduct?.grossQty || "",
    tareWeight: existingProduct?.tareWeight || "",
    price: existingProduct?.price || "",
    gst: existingProduct?.gst || "",
    isJobWork: existingProduct?.isJobWork || false,
    remarks: existingProduct?.remarks || "",
    jobWorkDetails: {
      partyName: existingProduct?.jobWorkDetails?.partyName || "",
      jobWorkRate: existingProduct?.jobWorkDetails?.jobWorkRate || "",
      issueDate: existingProduct?.jobWorkDetails?.issueDate || "",
      expectedReturnDate:
        existingProduct?.jobWorkDetails?.expectedReturnDate || "",
      quantitySent: existingProduct?.jobWorkDetails?.quantitySent || "",
    },
    srNo: existingProduct?.srNo || "",
    challanNo: existingProduct?.challanNo || "",
    lotNo: existingProduct?.lotNo || "",
  });

  // Toast popup state
  const [toastMessage, setToastMessage] = useState("");
  const [showToastPopup, setShowToastPopup] = useState(false);
  const [toastSuccess, setToastSuccess] = useState(false);

  const showToast = (msg, success = true) => {
    setToastMessage(msg);
    setToastSuccess(success);
    setShowToastPopup(true);
    setTimeout(() => setShowToastPopup(false), 3000);
  };

  // Fetch Categories & Suppliers
  useEffect(() => {
    axios
      .get("http://localhost:8080/getCategories")
      .then((res) => setCategories(res.data));
    axios
      .get("http://localhost:8080/getSuppliers")
      .then((res) => setSuppliers(res.data));
  }, []);

  // Fetch SubCategories when category changes
  useEffect(() => {
    if (categoryId) {
      axios
        .get(`http://localhost:8080/getSubCategories/${categoryId}`)
        .then((res) => setSubCategories(res.data));
    } else {
      setSubCategories([]);
    }
  }, [categoryId]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("jobWorkDetails.")) {
      const key = name.split(".")[1];
      setProductData({
        ...productData,
        jobWorkDetails: { ...productData.jobWorkDetails, [key]: value },
      });
    } else if (type === "checkbox") {
      setProductData({ ...productData, [name]: checked });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  // Submit Product (Add or Update)
  const handleSubmit = () => {
    if (!categoryId || !subCategoryId || !supplierId) {
      showToast("Please fill all details !", false);
      return;
    }

    const payload = {
      ...productData,
      category: categoryId,
      subCategory: subCategoryId,
      supplier: supplierId,
    };

    // Remove auto-generated fields for add
    delete payload.srNo;
    delete payload.challanNo;
    delete payload.lotNo;

    if (existingProduct?._id) {
      // UPDATE
      axios
        .put(
          `http://localhost:8080/updateProduct/${existingProduct._id}`,
          payload
        )
        .then(() => {
          showToast("Product Updated Successfully!", true);
          setTimeout(() => navigate("/home"), 1000);
        })
        .catch(() => showToast("Update Failed!", false));
    } else {
      // ADD
      axios
        .post("http://localhost:8080/addProduct", payload)
        .then(() => {
          showToast("Product Added Successfully!", true);
          setTimeout(() => navigate("/home"), 1000);
        })
        .catch(() => showToast("Something went wrong!", false));
    }
  };

  return (
    <div className="w-full min-h-screen bg-[rgba(0,0,0,0.85)] backdrop-blur-xl flex flex-col gap-[15px] text-white p-6">
      {/* Toast Popup */}
      {showToastPopup &&
        createPortal(
          <div
            className={`fixed left-1/2 transform -translate-x-1/2 top-[40px] px-6 py-3 rounded-lg shadow-lg font-semibold text-white
        backdrop-blur-md border border-white/30 z-[9999]
        transition-all duration-300
        ${
          toastSuccess
            ? "text-green-500 bg-[rgba(0,255,0,0.2)]"
            : "text-red-500 bg-[rgba(255,0,0,0.2)]"
        }`}
          >
            {toastMessage}
          </div>,
          document.body
        )}
      {/* LOGO + TITLE + H2 */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-lg">
        {/* Logo + Main Title */}
        <div className="flex items-center gap-4">
          <img
            src="https://res.cloudinary.com/dwx0y39ww/image/upload/v1764657357/Logo_d9mbbn.png"
            alt="BlueShelf Logo"
            className="w-16 h-16 md:w-20 md:h-20"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#3d87e0] tracking-wide">
              BlueShelf Inventory
            </h1>
            <p className="text-gray-300 text-sm md:text-base mt-1">
              Manage your inventory smartly
            </p>
          </div>
        </div>

        {/* Right-side H2 */}
        <h2 className="text-[#3d87e0] text-2xl font-extrabold tracking-wide">
          {existingProduct ? "Edit Product" : "Add Product"}
        </h2>
      </div>
      {/* Product Details */}
      <div className="w-full grid grid-cols-4 gap-[20px] items-start p-[20px] bg-[rgba(255,255,255,0.02)] border rounded-[15px] border-[rgba(255,255,255,0.25)]">
        <div className="w-full col-span-4">
          <h2 className="text-[#3d87e0] text-2xl md:text-3xl font-extrabold tracking-wide">
            Product Details
          </h2>
        </div>
        {/* Challan Date */}
        <div className="flex w-full flex-col justify-center items-start gap-[10px]">
          <label
            htmlFor="challanDate"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Select Challan Date...
          </label>
          <div className="relative w-full">
            <input
              type="date"
              name="challanDate"
              id="challanDate"
              placeholder="Challan Date"
              className="appearance-none uppercase border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
               placeholder:text-gray-300 placeholder:opacity-60
               transition-all focus:outline-none 
               hover:border-[#3d87e0] 
               focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
              value={productData.challanDate}
              onChange={handleChange}
            />
            {/* Custom white calendar icon */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* Iten Name */}
        <div className="flex w-full flex-col justify-center items-start gap-[10px]">
          <label
            htmlFor="itemName"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Enter Item Name...
          </label>

          <input
            type="text"
            name="itemName"
            id="itemName"
            className=" border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
                     placeholder:text-gray-300 placeholder:opacity-60
                     transition-all focus:outline-none 
                     hover:border-[#3d87e0] 
                     focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
            placeholder="Item Name"
            value={productData.itemName}
            onChange={handleChange}
          />
        </div>

        {/* Select Category */}
        <div className="flex w-full flex-col justify-start items-start gap-[10px]">
          <label
            htmlFor="category"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Select Category
          </label>

          <div className="flex w-full items-center gap-2">
            {/* Select + arrow wrapper */}
            <div className="relative flex-1">
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="appearance-none bg-[#1f1f1f] border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
                   placeholder:text-gray-300 placeholder:opacity-60
                   transition-all focus:outline-none 
                   hover:border-[#3d87e0] 
                   focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                    className="bg-[#1f1f1f] text-white"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Custom arrow */}
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Add button separate */}
            <button
              type="button"
              onClick={() => navigate("/addCategory")}
              className="text-white bg-[#3d87e0] hover:bg-[#2e6fc1] rounded-md px-4 py-2 text-xl font-bold transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* SubCategory Select */}
        <div className="flex w-full flex-col justify-start items-start gap-[10px]">
          <label
            htmlFor="subCategory"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Select SubCategory
          </label>

          <div className="flex w-full items-center gap-2">
            {/* Select + arrow wrapper */}
            <div className="relative flex-1">
              <select
                id="subCategory"
                value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
                className="appearance-none bg-[#1f1f1f] border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
                   placeholder:text-gray-300 placeholder:opacity-60
                   transition-all focus:outline-none 
                   hover:border-[#3d87e0] 
                   focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
              >
                <option value="">Select SubCategory</option>
                {subCategories.map((sub) => (
                  <option
                    key={sub._id}
                    value={sub._id}
                    className="bg-[#1f1f1f] text-white"
                  >
                    {sub.name}
                  </option>
                ))}
              </select>

              {/* Custom arrow */}
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Optional Add button */}
            {/* <button
              type="button"
              onClick={() => navigate("/addSubCategory")}
              className="text-white bg-[#3d87e0] hover:bg-[#2e6fc1] rounded-md px-4 py-2 text-xl font-bold transition-all"
            >
              +
            </button> */}
          </div>
        </div>

        {/* Color Input */}
        <div className="flex w-full flex-col justify-center items-start gap-[10px]">
          <label
            htmlFor="color"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Enter Color Details...
          </label>

          <input
            type="text"
            name="color"
            id="color"
            className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
             placeholder:text-gray-300 placeholder:opacity-60
             transition-all focus:outline-none 
             hover:border-[#3d87e0] 
             focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
            placeholder="Color"
            value={productData.color}
            onChange={handleChange}
          />
        </div>

        {/* Pattern Input */}
        <div className="flex w-full flex-col justify-center items-start gap-[10px]">
          <label
            htmlFor="pattern"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Enter Pattern Details...
          </label>

          <input
            type="text"
            name="pattern"
            id="pattern"
            className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
             placeholder:text-gray-300 placeholder:opacity-60
             transition-all focus:outline-none 
             hover:border-[#3d87e0] 
             focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
            placeholder="Pattern"
            value={productData.pattern}
            onChange={handleChange}
          />
        </div>

        {/* Fabric Type Input */}
        <div className="flex w-full flex-col justify-center items-start gap-[10px]">
          <label
            htmlFor="fabricType"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Enter Fabric Type...
          </label>

          <input
            type="text"
            name="fabricType"
            id="fabricType"
            className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
             placeholder:text-gray-300 placeholder:opacity-60
             transition-all focus:outline-none 
             hover:border-[#3d87e0] 
             focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
            placeholder="Fabric Type"
            value={productData.fabricType}
            onChange={handleChange}
          />
        </div>
      </div>
      {/* Product Specifications Section */}
      <div className="w-full grid grid-cols-4 gap-[20px] items-start p-[20px] bg-[rgba(255,255,255,0.02)] border rounded-[15px] border-[rgba(255,255,255,0.25)]">
        {/* Header */}
        <div className="w-full col-span-4 mb-4">
          <h2 className="text-[#3d87e0] text-2xl md:text-3xl font-extrabold tracking-wide">
            Product Specifications
          </h2>
        </div>

        {/* Width Input */}
        <div className="flex w-full flex-col justify-center items-start gap-[10px]">
          <label
            htmlFor="width"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Enter Width
          </label>
          <input
            type="text"
            name="width"
            id="width"
            placeholder="e.g., 45 inches"
            value={productData.width}
            onChange={handleChange}
            className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
       placeholder:text-gray-300 placeholder:opacity-60
       transition-all focus:outline-none 
       hover:border-[#3d87e0] 
       focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
          />
        </div>

        {/* GSM Input */}
        <div className="flex w-full flex-col justify-center items-start gap-[10px]">
          <label
            htmlFor="gsm"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Enter GSM
          </label>
          <input
            type="number"
            name="gsm"
            id="gsm"
            placeholder="e.g., 120"
            value={productData.gsm}
            onChange={handleChange}
            className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
       placeholder:text-gray-300 placeholder:opacity-60
       transition-all focus:outline-none 
       hover:border-[#3d87e0] 
       focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
          />
        </div>

        {/* Unit Input */}
        <div className="flex w-full flex-col justify-center items-start gap-[10px]">
          <label
            htmlFor="unit"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Enter Unit
          </label>
          <input
            type="text"
            name="unit"
            id="unit"
            placeholder="e.g., meters"
            value={productData.unit}
            onChange={handleChange}
            className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
       placeholder:text-gray-300 placeholder:opacity-60
       transition-all focus:outline-none 
       hover:border-[#3d87e0] 
       focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
          />
        </div>

        {/* Gross Qty Input */}
        <div className="flex w-full flex-col justify-center items-start gap-[10px]">
          <label
            htmlFor="grossQty"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Enter Gross Quantity
          </label>
          <input
            type="number"
            name="grossQty"
            id="grossQty"
            placeholder="e.g., 100"
            value={productData.grossQty}
            onChange={handleChange}
            className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
       placeholder:text-gray-300 placeholder:opacity-60
       transition-all focus:outline-none 
       hover:border-[#3d87e0] 
       focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
          />
        </div>

        {/* Tare Weight Input */}
        <div className="flex w-full flex-col justify-center items-start gap-[10px]">
          <label
            htmlFor="tareWeight"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Enter Tare Weight
          </label>
          <input
            type="number"
            name="tareWeight"
            id="tareWeight"
            placeholder="e.g., 5"
            value={productData.tareWeight}
            onChange={handleChange}
            className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
       placeholder:text-gray-300 placeholder:opacity-60
       transition-all focus:outline-none 
       hover:border-[#3d87e0] 
       focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
          />
        </div>

        {/* Price per Unit Input */}
        <div className="flex w-full flex-col justify-center items-start gap-[10px]">
          <label
            htmlFor="price"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Enter Price per Unit
          </label>
          <input
            type="number"
            name="price"
            id="price"
            placeholder="e.g., 250"
            value={productData.price}
            onChange={handleChange}
            className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
       placeholder:text-gray-300 placeholder:opacity-60
       transition-all focus:outline-none 
       hover:border-[#3d87e0] 
       focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
          />
        </div>

        {/* GST % Input */}
        <div className="flex w-full flex-col justify-center items-start gap-[10px]">
          <label
            htmlFor="gst"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Enter GST %
          </label>
          <input
            type="number"
            name="gst"
            id="gst"
            placeholder="e.g., 18"
            value={productData.gst}
            onChange={handleChange}
            className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
       placeholder:text-gray-300 placeholder:opacity-60
       transition-all focus:outline-none 
       hover:border-[#3d87e0] 
       focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
          />
        </div>
      </div>
      {/* Dropdowns */}
      {/* <div>
       

        
      </div> */}
      {/* Auto-generated fields (readonly) */}
      <div className="w-full grid grid-cols-4 gap-[20px] items-start p-[15px] bg-[rgba(255,255,255,0.02)] border rounded-[15px] border-[rgba(255,255,255,0.25)]">
        {/* Seriel No */}
        <div className="flex w-full flex-col justify-center items-start gap-[10px]">
          <label
            htmlFor="SrNo"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Seriel No...
          </label>
          <input
            className=" border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
                     placeholder:text-gray-300 placeholder:opacity-60
                     transition-all focus:outline-none 
                     hover:border-[#3d87e0] 
                     focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
            type="text"
            id="SrNo"
            placeholder="Serial No"
            value={productData.srNo || "Auto"}
            readOnly
          />
        </div>

        {/* Challan No */}
        <div className="flex w-full flex-col justify-center items-start gap-[10px]">
          <label
            htmlFor="ChallanNo"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Challan No...
          </label>
          <input
            type="text"
            id="ChallanNo"
            className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
                     placeholder:text-gray-300 placeholder:opacity-60
                     transition-all focus:outline-none 
                     hover:border-[#3d87e0] 
                     focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
            placeholder="Challan No"
            value={productData.challanNo || "Auto"}
            readOnly
          />
        </div>

        {/* Lot No */}
        <div className="flex w-full flex-col justify-center items-start gap-[10px]">
          <label
            htmlFor="LotNO"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Lot No...
          </label>
          <input
            type="text"
            id="LotNo"
            className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
                     placeholder:text-gray-300 placeholder:opacity-60
                     transition-all focus:outline-none 
                     hover:border-[#3d87e0] 
                     focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
            placeholder="Lot No"
            value={productData.lotNo || "Auto"}
            readOnly
          />
        </div>
        {/* HSN Code */}
        <div className="flex w-full flex-col justify-center items-start gap-[10px]">
          <label
            htmlFor="HsnCode"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Lot No...
          </label>
          <input
            type="text"
            id="HsnCode"
            className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
                     placeholder:text-gray-300 placeholder:opacity-60
                     transition-all focus:outline-none 
                     hover:border-[#3d87e0] 
                     focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
            placeholder="HSN No"
            value={productData.hsnCode || "Auto"}
            readOnly
          />
        </div>
      </div>
      {/* Supplier, Remarks & Job Work Section */}
      <div className="w-full grid grid-cols-4 gap-[20px] items-start p-[20px] bg-[rgba(255,255,255,0.02)] border rounded-[15px] border-[rgba(255,255,255,0.25)] mt-6">
        {/* Header */}
        <div className="w-full col-span-4 mb-4">
          <h2 className="text-[#3d87e0] text-2xl md:text-3xl font-extrabold tracking-wide">
            Supplier, Remarks & Job Work
          </h2>
        </div>

        {/* Supplier Select (1 col) */}
        <div className="flex w-full flex-col justify-start items-start gap-[10px] col-span-1">
          <label
            htmlFor="supplier"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Supplier
          </label>

          <div className="flex w-full items-center gap-2">
            <div className="relative flex-1">
              <select
                id="supplier"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="appearance-none bg-[#1f1f1f] border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
            transition-all focus:outline-none hover:border-[#3d87e0] focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((sup) => (
                  <option
                    key={sup._id}
                    value={sup._id}
                    className="bg-[#1f1f1f] text-white"
                  >
                    {sup.name} - {sup.companyName}
                  </option>
                ))}
              </select>

              {/* Custom arrow */}
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/addSupplier")}
              className="text-white bg-[#3d87e0] hover:bg-[#2e6fc1] rounded-md px-4 py-2 text-xl font-bold transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* Remarks Textarea (3 cols) */}
        <div className="flex w-full flex-col justify-start items-start gap-[10px] col-span-3">
          <label
            htmlFor="remarks"
            className="text-[#3d87e0] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
          >
            Remarks
          </label>
          <textarea
            name="remarks"
            id="remarks"
            placeholder="Any additional notes or comments"
            value={productData.remarks}
            onChange={handleChange}
            className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px] placeholder:text-gray-300 placeholder:opacity-60
        transition-all focus:outline-none hover:border-[#3d87e0] focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
            rows={1}
          ></textarea>
        </div>

        {/* Job Work Section */}
        <div className="w-full col-span-4 mt-4">
          <div className="flex items-center justify-between mt-4">
            {/* Job Work Toggle */}
            <div className="flex items-center gap-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isJobWork"
                  checked={productData.isJobWork}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-14 h-7 bg-[rgba(255,255,255,0.25)] rounded-full transition-colors duration-300
          ${
            productData.isJobWork
              ? "bg-[#3d87e0]"
              : "bg-[rgba(255,255,255,0.25)]"
          }`}
                ></div>
                <div
                  className={`absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
          ${productData.isJobWork ? "translate-x-7" : "translate-x-0"}`}
                ></div>
              </label>
              <span className="text-[#3d87e0] font-medium text-[20px] select-none">
                Job Work?
              </span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="bg-[#3d87e0] text-white border border-[#3d87e0] 
             px-6 py-2 rounded-[15px] font-medium tracking-wide
             transition-all duration-300 shadow-md focus:outline-0
             hover:bg-transparent hover:text-[#3d87e0] hover:shadow-[#3d87e0]/40 hover:scale-[1.02]
             focus:bg-transparent focus:text-[#3d87e0] focus:shadow-[#3d87e0]/40 focus:scale-[1.02]"
            >
              {existingProduct ? "Update Product" : "Add Product"}
            </button>
          </div>

          {/* Job Work Fields Card */}
          {productData.isJobWork && (
            <div className="w-full mt-[15px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.25)] rounded-lg p-4 grid grid-cols-2 gap-[20px]">
              <h3 className="col-span-2 text-[#3d87e0] font-semibold text-xl mb-2">
                Job Work Details
              </h3>

              <input
                type="text"
                name="jobWorkDetails.partyName"
                placeholder="Party Name (e.g., ABC Textiles)"
                value={productData.jobWorkDetails.partyName}
                onChange={handleChange}
                className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
      placeholder:text-gray-300 placeholder:opacity-60
      transition-all focus:outline-none hover:border-[#3d87e0] focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
              />

              <input
                type="number"
                name="jobWorkDetails.jobWorkRate"
                placeholder="Job Work Rate (e.g., 50)"
                value={productData.jobWorkDetails.jobWorkRate}
                onChange={handleChange}
                className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
      placeholder:text-gray-300 placeholder:opacity-60
      transition-all focus:outline-none hover:border-[#3d87e0] focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
              />

              {/* Issue Date */}
              <div className="relative w-full">
                <input
                  type="text"
                  name="jobWorkDetails.issueDate"
                  placeholder="Issue Date"
                  value={productData.jobWorkDetails.issueDate}
                  onChange={handleChange}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text";
                  }}
                  className="appearance-none Capitalized border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
      placeholder:text-gray-300 placeholder:opacity-60
      transition-all focus:outline-none 
      hover:border-[#3d87e0] 
      focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </span>
              </div>

              {/* Expected Return Date */}
              <div className="relative w-full">
                <input
                  type="text"
                  name="jobWorkDetails.expectedReturnDate"
                  placeholder="Expected Return Date"
                  value={productData.jobWorkDetails.expectedReturnDate}
                  onChange={handleChange}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text";
                  }}
                  className="appearance-none Capitalized border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
      placeholder:text-gray-300 placeholder:opacity-60
      transition-all focus:outline-none 
      hover:border-[#3d87e0] 
      focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </span>
              </div>

              <input
                type="number"
                name="jobWorkDetails.quantitySent"
                placeholder="Quantity Sent (e.g., 100)"
                value={productData.jobWorkDetails.quantitySent}
                onChange={handleChange}
                className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-full text-white p-[10px] font-light tracking-[0.5px]
      placeholder:text-gray-300 placeholder:opacity-60
      transition-all focus:outline-none hover:border-[#3d87e0] focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
