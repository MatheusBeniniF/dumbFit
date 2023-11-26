import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import ClienteDashboard from "./components/ClienteDashboard";
import PersonalDashboard from "./components/PersonalDashboard";
import DetalhesExercicio from "./components/DetalhesExercicio";
import DetalhesUsuario from "./components/DetalhesUsuario";
import DetalhesFicha from "./components/DetalhesFicha";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cliente-dashboard" element={<ClienteDashboard />} />
        <Route path="/personal-dashboard" element={<PersonalDashboard />} />
        <Route path="/detalhes/:id" element={<DetalhesExercicio />} />
        <Route path="cliente/:id" element={<DetalhesUsuario />} />
        <Route path="detalhes-ficha/:id" element={<DetalhesFicha />} />
        <Route path="*" element={<>Page not found</>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
