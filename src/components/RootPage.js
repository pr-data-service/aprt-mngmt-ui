import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Blogs from "../pages/Blogs";
import NoPages from '../pages/NoPage';
import HomePageComponent from "./HomePageComponent";
import Layout from "./Layout";

const RootPage = () => {

    return <>
       <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePageComponent />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="*" element={<NoPages />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
}

export default RootPage;