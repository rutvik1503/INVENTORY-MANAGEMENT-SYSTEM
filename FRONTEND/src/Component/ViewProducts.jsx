import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/getProductById/${id}`)
      .then((res) => {
        const data = res.data;
        setProduct(data);

        if (data.category) {
          axios.get(`http://localhost:8080/getCategories`)
            .then((catRes) => {
              const cat = catRes.data.find((c) => c._id === data.category);
              setCategoryName(cat ? cat.name : "N/A");
            });
        }

        if (data.subCategory) {
          axios.get(`http://localhost:8080/getSubCategories/${data.category}`)
            .then((subRes) => {
              const sub = subRes.data.find((s) => s._id === data.subCategory);
              setSubCategoryName(sub ? sub.name : "N/A");
            });
        }

        if (data.supplier) {
          axios.get(`http://localhost:8080/getSuppliers`)
            .then((supRes) => {
              const sup = supRes.data.find((s) => s._id === data.supplier);
              setSupplierName(sup ? sup.name : "N/A");
            });
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <div className="text-white p-4">Loading...</div>;

  const renderField = (label, value, highlight = false) => (
    <div className="flex flex-col mb-3">
      <span className="text-[#00d4ff] font-semibold">{label}</span>
      <span className={`mt-1 ${highlight ? "text-[#ffd700]" : ""}`}>{value || "-"}</span>
    </div>
  );

  const GlassCard = ({ title, children, pageBreak = false }) => (
    <div
      className={`p-6 mb-6 bg-[rgba(0,0,0,0.25)] backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${
        pageBreak ? "page-break-before print:page-break-before" : ""
      }`}
    >
      <h2 className="text-2xl font-bold text-[#00d4ff] mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-4 gap-x-6 gap-y-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-[rgba(0,0,0,0.25)] backdrop-blur-2xl text-white">
      {/* ---- LOGO + TITLE + Buttons ---- */}
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <img src="https://res.cloudinary.com/dwx0y39ww/image/upload/v1764657357/Logo_d9mbbn.png" className="w-[70px] h-[70px]" />
          <div>
            <h1 className="text-3xl font-extrabold text-[#00d4ff] tracking-wide">
              BlueShelf Inventory
            </h1>
            <p className="text-gray-300 text-sm mt-1">Manage your inventory smartly</p>
          </div>
        </div>
        {!isPrinting && (
          <div className="space-x-2">
            <button
              onClick={() => {
                setIsPrinting(true);
                setTimeout(() => {
                  window.print();
                  setIsPrinting(false);
                }, 100);
              }}
              className="px-4 py-2 bg-[#00d4ff] text-black rounded hover:bg-transparent hover:text-[#00d4ff] hover:border hover:border-[#00d4ff] transition-all"
            >
              Download / Print
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-[#ff4d4d] text-black rounded hover:bg-transparent hover:text-[#ff4d4d] hover:border hover:border-[#ff4d4d] transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <GlassCard title="Product Info">
        {renderField("Challan No", product.challanNo)}
        {renderField("Challan Date", formatDate(product.challanDate))}
        {renderField("HSN Code", product.hsnCode)}
        {renderField("Item Name", product.itemName)}
        {renderField("Category", categoryName || "Loading...")}
        {renderField("SubCategory", subCategoryName || "Loading...")}
        {renderField("Color", product.color)}
        {renderField("Fabric Type", product.fabricType)}
        {renderField("Pattern", product.pattern)}
        {renderField("Width", product.width)}
        {renderField("GSM", product.gsm)}
      </GlassCard>

      {/* Pricing & Stock */}
      <GlassCard title="Pricing & Stock">
        {renderField("Price", `₹${product.finalAmount.toLocaleString("en-IN")}/-`, true)}
        {renderField("GST %", product.gst)}
        {renderField("Quantity", product.quantity)}
      </GlassCard>

      {/* Supplier Info */}
      <GlassCard title="Supplier Info">
        {renderField("Supplier", supplierName || "Loading...", true)}
        {renderField("Job Work", product.isJobWork ? "Yes" : "No", product.isJobWork)}
      </GlassCard>

      {/* Job Work Details */}
      {product.isJobWork && product.jobWorkDetails && (
        <GlassCard title="Job Work Details">
          {Object.entries(product.jobWorkDetails).map(([key, val]) =>
            key.toLowerCase().includes("date") ? renderField(key, formatDate(val)) : renderField(key, val)
          )}
        </GlassCard>
      )}

      {/* Additional Info */}
      {product.additionalInfo && (
        <GlassCard title="Additional Info">
          {renderField("Notes", product.additionalInfo)}
        </GlassCard>
      )}
    </div>
  );
};

export default ViewProduct;
