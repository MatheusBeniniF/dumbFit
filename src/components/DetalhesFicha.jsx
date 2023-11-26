import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiAuthDelete, apiAuthPut, apiAuthGet, apiGetById } from "../apis";
import { Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Button,
} from "@mui/material";

const DetalhesFicha = () => {
  const [data, setData] = useState();
  const [erro, setErro] = useState();
  const [, setSuccess] = useState();

  const navigate = useNavigate();

  const [exercicios, setExercicios] = useState();
  const { id } = useParams();

  const exerciciosFiltrados = exercicios?.filter(
    (exercicio) => exercicio.fichaId === data?.id
  );

  const onExcluirExercicio = (exercicioId) => {
    apiAuthDelete("ExercicioRecord", exercicioId, setSuccess, setErro);
  };

  const verify = () => {
    if (exerciciosFiltrados.length === 0) {
      console.log("entrou");
      navigate("/personal-dashboard");
      apiAuthDelete("NovaFicha", id, setData, setErro);
    }
  };

  const onEditarExercicio = (exercicioId, field, value) => {
    const newObj = { [field]: value };
    apiAuthPut("ExercicioRecord", exercicioId, newObj, setSuccess, setErro);
  };

  useEffect(() => {
    apiGetById("NovaFicha", id, setData, setErro);
    apiAuthGet("ExercicioRecord/ExercicioRecord", setExercicios, setErro);

  }, [exercicios, exerciciosFiltrados]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-4">Lista de Exercícios</h1>
      {exerciciosFiltrados?.map((ex) => (
        <Card key={ex.id} className="mb-4">
          <CardContent className="flex flex-col gap-4">
            <Typography variant="h5" component="div" className="font-semibold">
              {ex.exercicio}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Repetições:{" "}
              <span
                contentEditable={true}
                onBlur={(e) =>
                  onEditarExercicio(ex.id, "repeticoes", e.target.innerText)
                }
              >
                {ex.repeticoes}
              </span>{" "}
              segundos
              <IconButton
                color="primary"
                onClick={() => {
                  const spanElement = document.getElementById(
                    `repeticoes-${ex.id}`
                  );
                  if (spanElement) spanElement.focus();
                }}
              >
                <Pencil />
              </IconButton>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intervalo:{" "}
              <span
                id={`intervalo-${ex.id}`}
                contentEditable={true}
                onBlur={(e) =>
                  onEditarExercicio(ex.id, "intervalo", e.target.innerText)
                }
              >
                {ex.intervalo}
              </span>{" "}
              segundos
              <IconButton
                color="primary"
                onClick={() => {
                  const spanElement = document.getElementById(
                    `intervalo-${ex.id}`
                  );
                  if (spanElement) spanElement.focus();
                }}
              >
                <Pencil />
              </IconButton>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Carga:{" "}
              <span
                id={`carga-${ex.id}`}
                contentEditable={true}
                onBlur={(e) =>
                  onEditarExercicio(ex.id, "carga", e.target.innerText)
                }
              >
                {ex.carga || "Não especificada"}
              </span>
              <IconButton
                color="primary"
                onClick={() => {
                  const spanElement = document.getElementById(`carga-${ex.id}`);
                  if (spanElement) spanElement.focus();
                }}
              >
                <Pencil />
              </IconButton>
            </Typography>
          </CardContent>
          <div className="flex gap-2 p-4">
            <IconButton color="error" onClick={() => onExcluirExercicio(ex.id)}>
              <Trash2 /> Excluir
            </IconButton>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DetalhesFicha;
