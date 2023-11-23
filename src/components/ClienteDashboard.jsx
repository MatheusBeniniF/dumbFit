import React, { useEffect, useState } from "react";
import { apiGet } from "../apis";
import FichaCard from "./FichaCard";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./Logout";

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
  }, [exercicios]);

  return (
    <div className="p-8">
      {fichas?.map(
        (ficha, index) =>
          ficha.user.includes(user) && (
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
      {fichas?.every((ficha) => !ficha.user.includes(user)) && (
        <div className="p-20">
          <div className="flex flex-col items-center justify-center h-40 bg-white rounded-lg">
            <p className="text-gray-500 text-lg mb-4">
              Usuario sem ficha cadastrada
            </p>
            <button
              // onClick={onRequestNovaFicha}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-800"
            >
              Solicitar Nova Ficha
            </button>
          </div>
        </div>
      )}
      <LogoutButton />
    </div>
  );
};

export default ClienteDashboard;
