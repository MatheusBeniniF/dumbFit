import React, { useCallback, useEffect, useState } from "react";
import { apiGetById } from "../apis";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Play } from "lucide-react";

const DetalhesExercicio = () => {
  const [exercicio, setExercicio] = useState();
  const [exercicioErro, setExercicioErro] = useState("");
  const [tempoRestante, setTempoRestante] = useState();
  const [timerRunning, setTimerRunning] = useState(false);

  const startTimer = () => {
    setTimerRunning(true);
  };

  const resetTimer = useCallback(() => {
    setTempoRestante(exercicio?.intervalo);
    setTimerRunning(false);
  }, [exercicio?.intervalo]);

  useEffect(() => {
    let timer;

    if (timerRunning && tempoRestante > 0) {
      timer = setInterval(() => {
        setTempoRestante((prevTempo) => prevTempo - 1);
      }, 1000);
    } else {
      resetTimer();
    }

    return () => clearInterval(timer);
  }, [timerRunning, tempoRestante, exercicio?.intervalo]);

  const { id } = useParams();

  useEffect(() => {
    apiGetById("ExercicioRecord", id, setExercicio, setExercicioErro);
    resetTimer();
  }, [resetTimer]);

  return (
    <div className="p-8">
      <Link
        to="/cliente-dashboard"
        className="flex items-center mb-4 text-gray-600 hover:text-gray-800"
      >
        <ChevronLeft className="w-6 h-6 mr-2" />
        Voltar ao Dashboard
      </Link>
      {exercicio && (
        <>
          <h1 className="text-black font-extrabold text-5xl capitalize mb-4">
            {exercicio.exercicio}
          </h1>
          <div className="mt-2 p-4 bg-gray-100 rounded-lg shadow-md">
            <p className="text-gray-800 font-semibold mb-2">
              Repetições: {exercicio.repeticoes}
            </p>
            <p className="text-gray-800 font-semibold mb-2">
              Quantidade de Séries: {exercicio.qtdSeries}
            </p>
            {Array.from({ length: exercicio.qtdSeries }, (_, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`serie-${index + 1}`}
                  className="text-green-500"
                />
                <label
                  htmlFor={`serie-${index + 1}`}
                  className="ml-2 text-gray-700"
                >
                  Série {index + 1}
                </label>
              </div>
            ))}

            <div className="flex gap-4 items-center">
              <p className="text-gray-800 font-semibold mb-2">
                Descanso: {tempoRestante} segundos
              </p>
              <button
                className="bg-gray-500 hover:bg-gray-800 text-white p-2 rounded cursor-pointer transition ease-in-out delay-150"
                disabled={timerRunning}
                onClick={() => {
                  if (!timerRunning) {
                    startTimer();
                  } else {
                    resetTimer();
                  }
                }}
              >
                <Play className="w-6 h-6" />
              </button>
            </div>
          </div>
        </>
      )}
      {exercicioErro && (
        <p className="text-red-500 mb-4">{exercicioErro.response?.data}</p>
      )}
    </div>
  );
};

export default DetalhesExercicio;
