import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from "./Component/LogIn";
import HomePage from "./Component/HomePage";
import AddProductForm from "./Component/AddProductForm";
import AddCategoryForm from "./Component/AddCategoryForm";
import AddSupplierForm from "./Component/AddSupplierForm";
import ViewProducts from "./Component/ViewProducts";
import ProtectedRoute from "./Component/ProtectedRoute"; // import it

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LogIn />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addCategory"
          element={
            <ProtectedRoute>
              <AddCategoryForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addSupplier"
          element={
            <ProtectedRoute>
              <AddSupplierForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addProduct"
          element={
            <ProtectedRoute>
              <AddProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addProduct/:id?"
          element={
            <ProtectedRoute>
              <AddProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewProduct/:id?"
          element={
            <ProtectedRoute>
              <ViewProducts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
