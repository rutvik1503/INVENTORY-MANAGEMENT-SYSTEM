import React, { useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

const ToastPopup = ({ message, success }) => {
  return createPortal(
    <div
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

const AddSupplierForm = () => {
  const navigate = useNavigate();
  const [supplierData, setSupplierData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    gstNumber: "",
    companyName: "",
  });

  const [toastMessage, setToastMessage] = useState("");
  const [toastSuccess, setToastSuccess] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const showToastHandler = (msg, success = true) => {
    setToastMessage(msg);
    setToastSuccess(success);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierData({ ...supplierData, [name]: value });
  };

  const handleSubmit = () => {
    const emptyField = Object.values(supplierData).some((v) => !v.trim());
    if (emptyField) {
      showToastHandler("Please fill all fields", false);
      return;
    }

    axios
      .post("http://localhost:8080/addSupplier", supplierData)
      .then(() => {
        showToastHandler("Supplier Added Successfully!", true);
        setSupplierData({
          name: "",
          mobile: "",
          email: "",
          address: "",
          gstNumber: "",
          companyName: "",
        });
        setTimeout(() => navigate("/addProduct"), 1000);
      })
      .catch(() => showToastHandler("Failed to add supplier", false));
  };

  return createPortal(
    <>
      {/* Full page background */}
      <div
        className="fixed inset-0 z-[998]"
        style={{
          backgroundImage: `url("https://res.cloudinary.com/dwx0y39ww/image/upload/v1764657714/SupplierBg_rsfoch.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* Modal overlay */}
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[999] flex items-center justify-center"></div>

      {/* Modal form */}
      <div className="fixed z-[1000] w-[90%] max-w-2xl p-6 backdrop-blur-md rounded-2xl border border-[rgba(255,255,255,0.25)] text-white shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(0,0,0,0.6)]">
        {/* Close Button */}
        <button
          onClick={() => navigate("/addProduct")}
          className="absolute top-3 right-3 text-red-500 text-5xl font-normal hover:text-red-700 transition"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-[#3d87e0] mb-4">Add Supplier</h2>

        {/* 2-column grid form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(supplierData).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="font-medium text-[#FFD700] capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={key === "email" ? "email" : "text"}
                name={key}
                placeholder={key.replace(/([A-Z])/g, " $1")}
                value={supplierData[key]}
                onChange={handleChange}
                className="p-2 rounded-md bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.25)] focus:outline-none focus:ring-2 focus:ring-[#3d87e0] transition-all text-white"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-[#3d87e0] hover:bg-[#2e6fc1] px-4 py-2 rounded-md font-semibold transition-all mt-4"
        >
          Add Supplier
        </button>
      </div>

      {/* Toast Popup */}
      {showToast && <ToastPopup message={toastMessage} success={toastSuccess} />}
    </>,
    document.body
  );
};

export default AddSupplierForm;
