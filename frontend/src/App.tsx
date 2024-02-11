import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Product from "./components/Product";
import ProductCreate from "./components/ProductCreate";
import ProductEdit from "./components/ProductEdit";
import { ProductInterface } from "./models/IProduct";
import Customer from "./components/Customer";
import CustomerCreate from "./components/CustomerCreate";

export default function App() {
  const handleCancle = () => {
  };
  const [productData, ] = React.useState<ProductInterface | undefined>(undefined);
  return (

    <Router>

      <div>

        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product"  element={<Product />} />
          <Route path="/productcreate"  element={<ProductCreate />} />
          <Route path="/productedit" element={<ProductEdit Cancle={handleCancle} Data={productData} />}/>
          <Route path="/customer"  element={<Customer />} />
          <Route path="/customercreate"  element={<CustomerCreate />} />
        </Routes>

      </div>

    </Router>

  );

}
