import React, { useCallback, useEffect, useState } from "react";
import { apiGetById, apiPut } from "../apis";
import { Link, useParams } from "react-router-dom";
import { CheckCircle, ChevronLeft, Pencil, Play, XCircle } from "lucide-react";
import { IconButton, Snackbar } from "@mui/material";

const DetalhesExercicio = () => {
  const [exercicio, setExercicio] = useState();
  const [, setExercicioErro] = useState("");
  const [tempoRestante, setTempoRestante] = useState();
  const [timerRunning, setTimerRunning] = useState(false);
  const [, setSuccess] = useState();
  const [error, setError] = useState();
  const [openConfirmation, setOpenConfirmation] = useState(false);

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

  const onEditarExercicio = (exercicio, field, value) => {
    const newObj = { ...exercicio, [field]: value };
    apiPut("ExercicioRecord", exercicio.id, newObj, setSuccess, setError);
    if (!error) {
      setOpenConfirmation(true);
    }
  };

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
            <p className="text-gray-800 font-semibold mb-2">
              Carga:{" "}
              <span
                id={`carga-${exercicio.carga}`}
                contentEditable={true}
                className="p-2 mr-2 cursor-pointer "
                onBlur={(e) =>
                  onEditarExercicio(exercicio, "carga", e.target.innerText)
                }
              >
                {exercicio.carga}
              </span>{" "}
              <IconButton
                color="primary"
                onClick={() => {
                  const spanElement = document.getElementById(
                    `carga-${exercicio.carga}`
                  );
                  if (spanElement) spanElement.focus();
                }}
              >
                <Pencil />
              </IconButton>
            </p>
            <p className="text-gray-800 font-semibold mb-2">
              Anotações:{" "}
              <span
                id={`anotacoes-${exercicio.anotacoes}`}
                contentEditable={true}
                className="p-2 mr-2 cursor-pointer "
                onBlur={(e) =>
                  onEditarExercicio(exercicio, "anotacoes", e.target.value)
                }
              >
                <textarea>{exercicio.anotacoes}</textarea>
              </span>{" "}
              <IconButton
                color="primary"
                onClick={() => {
                  const spanElement = document.getElementById(
                    `anotacoes-${exercicio.anotacoes}`
                  );
                  if (spanElement) spanElement.focus();
                }}
              >
                <Pencil />
              </IconButton>
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
      <Snackbar
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
        open={openConfirmation}
        autoHideDuration={3000}
        onClose={() => setOpenConfirmation(false)}
      >
        {!error ? (
          <div className="bg-green-500 text-white p-4 rounded flex items-center">
            <CheckCircle className="w-6 h-6 mr-2" />
            Ficha editada com sucesso!
          </div>
        ) : (
          <div className="bg-red-500 text-white p-4 rounded flex items-center">
            <XCircle className="w-6 h-6 mr-2" />
            Algo deu errado, tente novamente!
          </div>
        )}
      </Snackbar>
    </div>
  );
};

export default DetalhesExercicio;
