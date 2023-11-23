import React, { useEffect, useState } from "react";
import { apiGet, checarAutenticacao } from "../apis";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./Logout";

const PersonalDashboard = () => {
  const [data, setData] = useState();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const sucesso = (result) => {
    console.log(result);
    setData(result);
    console.log(data?.exercicio);
  };

  const erro = (e) => {
    setError(e.response.data);
  };

  const redirect = (route) => {
    navigate(route);
  };

  useEffect(() => {
    apiGet("NovaFicha", sucesso, erro);
    checarAutenticacao(redirect);
    const userRole = localStorage.getItem("usuario_permissao");
    userRole === "Member" && redirect("/cliente-dashboard");
  }, []);

  return (
    <>
      Personal dashboard
      <LogoutButton />
    </>
  );
};

export default PersonalDashboard;
