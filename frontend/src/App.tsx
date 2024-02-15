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
import HeaderDetail from "./components/HeaderDetail";
import HeaderCreate from "./components/HeaderCreate";
import DetailCreate from "./components/DetailCreate";
import Detail from "./components/Detail";
import HeaderEdit from "./components/HeaderEdit";
import CustomerEdit from "./components/CustomerEdit";
import { CustomerInterface } from "./models/ICustomer";
import Master from "./components/Master";
import DetailPrint from "./components/DetailPrint";
import { DetailInterface } from "./models/IDetail";
import DetailEdit from "./components/DetailEdit";
import Header from "./components/Header";
import { HeaderInterface } from "./models/IHeader";
import Report from "./components/Report";

export default function App() {
  const handleCancle = () => {
  };
  const [productData, ] = React.useState<ProductInterface | undefined>(undefined);
  const [customerData, ] = React.useState<CustomerInterface | undefined>(undefined);
  const [detailData, ] = React.useState<DetailInterface | undefined>(undefined);
  const [headerData, ] = React.useState<HeaderInterface | undefined>(undefined);
  return (

    <Router>

      <div>

        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product"  element={<Product />} />
          <Route path="/productcreate"  element={<ProductCreate />} />
          <Route path="/productedit" element={<ProductEdit Cancle={handleCancle} Data={productData} />}/>
          <Route path="/customeredit" element={<CustomerEdit Cancle={handleCancle} Data={customerData} />}/>
          <Route path="/customer"  element={<Customer />} />
          <Route path="/customercreate"  element={<CustomerCreate />} />
          <Route path="/headerdetail"  element={<HeaderDetail />} />
          <Route path="/headercreate"  element={<HeaderCreate />} />
          <Route path="/detailcreate"  element={<DetailCreate />} />
          <Route path="/detail"  element={<Detail />} />
          <Route path="/headeredit"  element={<HeaderEdit Cancle={handleCancle} Data={headerData} />}/>
          <Route path="/master"  element={<Master />} />
          <Route path="/detailprint"  element={<DetailPrint/>} />
          <Route path="/productedit" element={<DetailEdit Cancle={handleCancle} Data={detailData} />}/>
          <Route path="/header"  element={<Header />} />
          <Route path="/report"  element={<Report />} />
        </Routes>

      </div>

    </Router>

  );

}
