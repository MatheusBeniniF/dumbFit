import { Button } from "@mui/material";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAuthDelete, apiAuthPut } from "../apis";

const FichaCard = ({ ficha, exercicios, user, setMessage }) => {
  const [, setSuccess] = useState();
  const [erro, setErro] = useState();
  const navigate = useNavigate();

  const userLogged = localStorage.getItem("usuario_permissao");
  const exerciciosFiltrados = exercicios?.filter(
    (exercicio) => exercicio.fichaId === ficha?.id
  );

  const handleExerciseInfo = (event, info) => {
    event.preventDefault();
    navigate(`/detalhes-ficha/${info.id}`);
  };

  const deletarFicha = (id) => {
    apiAuthDelete("NovaFicha", id, setSuccess, setErro);
    if (!erro) {
      setMessage("Ficha excluida");
    }
    if (ficha?.length === 1) {
      const newObj = { ...user, temFicha: false };
      apiAuthPut("NewUsuario", user.id, newObj, setSuccess, setErro);
      exerciciosFiltrados?.forEach((ex) => {
        apiAuthDelete("ExercicioRecord", ex.id, setSuccess, setErro);
      });
    }
  };

  return (
    <div>
      {ficha?.map((f, index) => (
        <div
          key={index}
          className="transition duration-300 ease-in-out transform hover:scale-105 border border-gray-300 rounded-full p-4 my-4 mx-4 flex flex-col justify-between items-center shadow-md hover:bg-white bg-gray-100"
        >
          <span className="capitalize mb-2 font-bold">{f.titulo}</span>
          <div className="flex flex-col items-center justify-center">
            {userLogged === "Admin" && (
              <div className="flex flex-row">
                <Button color="error" onClick={() => deletarFicha(f.id)}>
                  <Trash2 />
                </Button>
              </div>
            )}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:bg-blue-800"
              onClick={(e) => handleExerciseInfo(e, f)}
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      ))}
      {erro && <p className="text-red-500 mb-4">{erro.response?.data}</p>}
    </div>
  );
};

export default FichaCard;
