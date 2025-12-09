// import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";

// type Props = {}

const App = () => {
  return (
    <>
      <BrowserRouter basename="/AI-Component-Generator">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/" element={<NoPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
