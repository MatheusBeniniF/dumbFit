import React from "react";
import { useNavigate } from "react-router-dom";

const ExercicioCard = ({ ficha, exercicios, user, error }) => {
  const navigate = useNavigate();
  const exerciciosFiltrados = exercicios?.filter(
    (exercicio) => exercicio.fichaId === ficha.id && ficha.user === user
  );
  console.log(ficha, exercicios, user);

  const handleExerciseInfo = (event, info) => {
    event.preventDefault();
    navigate(`/detalhes/${info.id}`);
  };

  return (
    <div>
      {exerciciosFiltrados?.map((exercicio, index) => (
        <div
          key={index}
          className="transition duration-300 ease-in-out transform hover:scale-105 border border-gray-300 rounded-full p-4 my-4 mx-4 flex flex-col justify-between items-center shadow-md hover:bg-white bg-gray-100"
        >
          <span className="capitalize mb-2">{exercicio.titulo}</span>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:bg-blue-800"
            onClick={(e) => handleExerciseInfo(e, exercicio)}
          >
            Ver Detalhes
          </button>
        </div>
      ))}
      {error && <p className="text-red-500 mb-4">{error.response?.data}</p>}
    </div>
  );
};

export default ExercicioCard;
