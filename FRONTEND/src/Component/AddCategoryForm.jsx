import React, { useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import AOS from "aos";
import "aos/dist/aos.css";

const ToastPopup = ({ message, success }) => {
  return createPortal(
    <div
      data-aos="zoom-in-down"
      data-aos-duration="600"
      className={`fixed top-[25px] left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl shadow-lg backdrop-blur-md border ${
        success
          ? "bg-[rgba(0,255,0,0.25)] border-green-500 text-white"
          : "bg-[rgba(255,0,0,0.25)] border-red-500 text-white"
      } font-semibold transition-all duration-300`}
    >
      {message}
    </div>,
    document.body
  );
};

const AddCategoryForm = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [showSubForm, setShowSubForm] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [subCategories, setSubCategories] = useState([""]);

  const [toastMessage, setToastMessage] = useState("");
  const [toastSuccess, setToastSuccess] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const showToastHandler = (msg, success = true) => {
    setToastMessage(msg);
    setToastSuccess(success);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmitCategory = () => {
    if (!categoryName.trim()) {
      showToastHandler("Please enter category name", false);
      return;
    }

    axios
      .post(
        "https://inventory-management-system-8t3d.onrender.com/addCategory",
        { categoryName }
      )
      .then((res) => {
        showToastHandler("Category Added Successfully");
        setCategoryId(res.data.categoryId);
        setShowSubForm(true);
        setCategoryName("");
      })
      .catch(() => showToastHandler("Failed to add category", false));
  };

  const addField = () => setSubCategories([...subCategories, ""]);

  const handleChange = (index, value) => {
    const updated = [...subCategories];
    updated[index] = value;
    setSubCategories(updated);
  };

  const handleSubmitSub = () => {
    if (subCategories.some((sub) => !sub.trim())) {
      showToastHandler("Please fill all sub category fields", false);
      return;
    }

    axios
      .post(
        "https://inventory-management-system-8t3d.onrender.com/addSubCategory",
        {
          categoryId,
          subCategories,
        }
      )
      .then(() => {
        showToastHandler("Sub Categories Added Successfully");
        setSubCategories([""]);
        setShowSubForm(false);
        navigate("/addProduct"); // Redirect to AddProduct
      })
      .catch(() => showToastHandler("Failed to add sub categories", false));
  };

  return createPortal(
    <>
      {/* Full page background */}
      <div
        className="fixed inset-0 z-[998]"
        style={{
          backgroundImage: `url("https://res.cloudinary.com/dwx0y39ww/image/upload/v1764660903/CategoryBg_dtkg7x.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* Modal overlay */}
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[999] flex items-center justify-center"></div>

      {/* Modal form */}
      <div data-aos="zoom-in-down" data-aos-duration="600" className="fixed z-[1000] w-[90%] max-w-xl p-6 backdrop-blur-md rounded-2xl border border-[rgba(255,255,255,0.25)] text-white shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(0,0,0,0.6)]">
        <h2 className="text-2xl font-bold text-[#3d87e0] mb-4">Add Category</h2>

        {/* Category Input */}
        <div className="mb-4 flex flex-col gap-2">
          <label htmlFor="categoryName" className="font-medium text-lg">
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            placeholder="Enter Category"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="p-2 rounded-md bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.25)] focus:outline-none focus:ring-2 focus:ring-[#3d87e0] transition-all text-white"
          />
        </div>

        <button
          onClick={handleSubmitCategory}
          className="bg-[#3d87e0] hover:bg-[#2e6fc1] px-4 py-2 rounded-md font-semibold transition-all"
        >
          Submit Category
        </button>

        {/* Sub Categories Form */}
        {showSubForm && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-[#3d87e0] mb-2">
              Add Sub Categories
            </h3>
            {subCategories.map((sub, index) => (
              <div key={index} className="flex flex-col mb-2">
                <label className="font-medium">Sub Category {index + 1}</label>
                <input
                  type="text"
                  placeholder={`Sub Category ${index + 1}`}
                  value={sub}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="p-2 rounded-md bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.25)] focus:outline-none focus:ring-2 focus:ring-[#3d87e0] transition-all text-white"
                />
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <button
                onClick={addField}
                className="bg-[#3d87e0] hover:bg-[#2e6fc1] px-3 py-1 rounded-md font-semibold transition-all"
              >
                + Add More
              </button>
              <button
                onClick={handleSubmitSub}
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md font-semibold transition-all"
              >
                Submit Sub Categories
              </button>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={() => navigate("/addProduct")} // Redirect on close
          className="absolute top-3 right-3 text-red-500 text-5xl font-normal"
        >
          ×
        </button>
      </div>

      {/* Toast Popup */}
      {showToast && (
        <ToastPopup message={toastMessage} success={toastSuccess} />
      )}
    </>,
    document.body
  );
};

export default AddCategoryForm;
