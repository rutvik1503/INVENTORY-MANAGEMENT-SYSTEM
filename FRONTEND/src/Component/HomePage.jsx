import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // ---- Popup States ----
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // success | error | confirm
  const [showPopup, setShowPopup] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // ---- Reusable Toast Function ----
  const showToast = (msg, type = "success") => {
    setPopupMessage(msg);
    setPopupType(type);
    setShowPopup(true);

    if (type !== "confirm") {
      setTimeout(() => setShowPopup(false), 2500);
    }
  };

  // ---- Confirm Popup Function ----
  const showConfirm = (msg, action) => {
    setPopupMessage(msg);
    setPopupType("confirm");
    setConfirmAction(() => action);
    setShowPopup(true);
  };

  // Filter Colors
  const filterColors = {
    all: "#3d87e0",
    jobwork: "#16a34a",
    nonjobwork: "#8b5cf6",
  };
  const activeColor = filterColors[filter];

  // Load all products
  const loadProducts = () => {
    axios
      .get("https://inventory-management-system-8t3d.onrender.com/getAllProduct")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ---- Delete Product (Custom Confirm Popup) ----
  const deleteProduct = (id) => {
    showConfirm("Are you sure you want to delete this product?", async () => {
      try {
        await axios.delete(`https://inventory-management-system-8t3d.onrender.com/deleteProduct/${id}`);
        showToast("Product Deleted Successfully!", "success");
        loadProducts();
      } catch (error) {
        showToast("Delete Failed!", "error");
      }
    });
  };

  // ---- Logout Function ----
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove auth token
    navigate("/"); // redirect to login
  };

  // Filter + search
  const filteredProducts = products.filter((item) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "jobwork"
        ? item.isJobWork
        : !item.isJobWork;

    const matchesSearch =
      item.itemName?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const formatIndianNumber = (num) => {
    return num.toLocaleString("en-IN");
  };

  return (
    <div className="relative w-full min-h-screen bg-[rgba(0,0,0,0.85)] backdrop-blur-xl text-white p-6">
      {/* ---- Toast + Confirm Popup ---- */}
      {showPopup && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl 
      backdrop-blur-md border shadow-xl text-white font-semibold transition-all z-50
      ${
        popupType === "success"
          ? "bg-green-500/30 border-green-400"
          : popupType === "error"
          ? "bg-red-500/30 border-red-400"
          : "bg-red-600/30 border-red-500" // 🔴 CONFIRM POPUP RED
      }`}
        >
          <div className="text-center">{popupMessage}</div>

          {/* Confirm Buttons */}
          {popupType === "confirm" && (
            <div className="flex justify-center gap-4 mt-3">
              <button
                onClick={() => {
                  setShowPopup(false);
                  confirmAction();
                }}
                className="px-4 py-1 rounded bg-red-600 hover:bg-red-700"
              >
                Yes
              </button>

              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-1 rounded bg-gray-400 hover:bg-gray-500"
              >
                No
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---- LOGO + TITLE + LOGOUT ---- */}
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <img src="https://res.cloudinary.com/dwx0y39ww/image/upload/v1764657357/Logo_d9mbbn.png" className="w-[70px] h-[70px]" />
          <div>
            <h1 className="text-3xl font-extrabold text-[#3d87e0] tracking-wide">
              BlueShelf Inventory
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              Manage your inventory smartly
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 rounded-lg text-white font-medium hover:bg-red-600 transition-all"
        >
          Logout
        </button>
      </div>

      {/* ---- SEARCH + ADD BUTTON ---- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="border border-gray-500 bg-transparent px-4 py-2 rounded-lg 
          text-white tracking-wide w-full md:w-3/4
          focus:border-[#3d87e0] focus:ring-1 focus:ring-[#3d87e0] outline-none transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => navigate("/addProduct")}
          className="bg-[#3d87e0] w-full md:w-1/4 px-6 py-2 rounded-lg font-medium tracking-wide 
          hover:bg-transparent hover:text-[#3d87e0] hover:border hover:border-[#3d87e0] transition-all duration-300 hover:scale-[1.03]"
        >
          + Add Product
        </button>
      </div>

      {/* ---- FILTER BUTTONS ---- */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {["all", "jobwork", "nonjobwork"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`py-3 border border-[rgba(255,255,255,0.5)] text-center 
            font-medium tracking-wide rounded-xl transition-all ${
              filter === type
                ? "text-white shadow-md"
                : "text-gray-300 hover:text-white hover:bg-[rgba(61,135,224,0.2)]"
            }`}
            style={
              filter === type
                ? {
                    backgroundColor: filterColors[type],
                    borderColor: filterColors[type],
                  }
                : {}
            }
          >
            {type === "all"
              ? "All"
              : type === "jobwork"
              ? "Job Work"
              : "Non Job Work"}
          </button>
        ))}
      </div>

      {/* ---- TABLE ---- */}
      <div className="overflow-x-auto rounded-xl border border-gray-700">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr
              className="text-white rounded-lg transition-all"
              style={{ backgroundColor: activeColor }}
            >
              <th className="p-3 font-normal text-left">Sr No</th>
              <th className="p-3 font-normal text-center">Challan No.</th>
              <th className="p-3 font-normal text-center">Item Name</th>
              <th className="p-3 font-normal text-center">HSN Code</th>
              <th className="p-3 font-normal text-center">Price</th>
              <th className="p-3 font-normal text-center w-[200px]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No Products Found
                </td>
              </tr>
            ) : (
              filteredProducts.map((item, index) => (
                <tr
                  key={item._id}
                  className={`transition ${
                    index % 2 === 0
                      ? "bg-[rgba(0,0,0,0.1)]"
                      : "bg-[rgba(255,255,255,0.03)]"
                  }`}
                  style={{ minHeight: "50px" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = activeColor + "33")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      index % 2 === 0
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.1)")
                  }
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 text-center">{item.challanNo}</td>
                  <td className="p-3 text-center">{item.itemName}</td>
                  <td className="p-3 text-center">{item.hsnCode}</td>
                  <td className="p-3 text-center">
                    ₹ {formatIndianNumber(item.finalAmount)}/-
                  </td>

                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => navigate("/addProduct", { state: item })}
                      className="px-3 py-1 text-blue-500 hover:text-white hover:bg-blue-500 rounded transition-all"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => navigate(`/viewProduct/${item._id}`)}
                      className="px-3 py-1 text-green-500 hover:text-white hover:bg-green-500 rounded transition-all"
                    >
                      View
                    </button>

                    <button
                      onClick={() => deleteProduct(item._id)}
                      className="px-3 py-1 text-red-500 hover:text-white hover:bg-red-500 rounded transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomePage;
