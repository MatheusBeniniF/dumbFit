import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import ClienteDashboard from "./components/ClienteDashboard";
import PersonalDashboard from "./components/PersonalDashboard";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cliente-dashboard" element={<ClienteDashboard />} />
        <Route path="/personal-dashboard" element={<PersonalDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
