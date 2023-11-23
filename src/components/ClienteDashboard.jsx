import React, { useEffect, useState } from "react";
import { apiGet } from "../apis";
import FichaCard from "./FichaCard";
import { useNavigate } from "react-router-dom";

const ClienteDashboard = () => {
  const [exercicios, setExercicios] = useState();
  const [fichas, setFichas] = useState();
  const [exercicioErro, setExercicioErro] = useState("");
  const [fichaErro, setFichaErro] = useState("");
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const redirect = (route) => {
    navigate(route);
  };

  useEffect(() => {
    apiGet("ExercicioRecord/ExercicioRecord", setExercicios, setExercicioErro);
    apiGet("NovaFicha", setFichas, setFichaErro);
    setUser(localStorage.getItem("usuario_nome"));

    const userRole = localStorage.getItem("usuario_permissao");
    userRole === "Admin" && redirect("/personal-dashboard");
  }, [exercicios, fichas, user]);

  return (
    <div className="bg-[#cfcfcf] p-8">
      {fichas?.map(
        (ficha, index) =>
          user === ficha.user && (
            <div key={index} className="flex flex-col gap-4">
              <h1 className="text-black font-extrabold text-5xl capitalize">
                {ficha?.titulo}
              </h1>
              {fichaErro && (
                <p className="text-red-500 mb-4">{fichaErro.response?.data}</p>
              )}
              <p className="text-gray-800 font-bold text-lg">
                Lista de exercicios
              </p>
              <FichaCard
                key={index}
                ficha={ficha}
                exercicios={exercicios}
                user={user}
                error={exercicioErro}
              />
            </div>
          )
      )}
    </div>
  );
};

export default ClienteDashboard;
