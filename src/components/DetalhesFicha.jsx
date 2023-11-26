import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { apiAuthDelete, apiAuthPut, apiAuthGet, apiGetById } from "../apis";
import { CheckCircle, Pencil, Trash2, XCircle, ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";

const DetalhesFicha = () => {
  const [data, setData] = useState();
  const [users, setUsers] = useState();
  const [erro, setErro] = useState();
  const [, setSuccess] = useState();
  const [message, setMessage] = useState("");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const navigate = useNavigate();

  const [exercicios, setExercicios] = useState();
  const { id } = useParams();

  const exerciciosFiltrados = exercicios?.filter(
    (exercicio) => exercicio.fichaId === data?.id
  );

  const usuariosFiltrados = users?.find((user) => data.user === user.email);

  const onExcluirExercicio = (exercicioId) => {
    apiAuthDelete("ExercicioRecord", exercicioId, setSuccess, setErro);
    if (!erro) {
      verify();
    }
  };

  const verify = () => {
    if (exerciciosFiltrados.length === 1) {
      apiAuthDelete("NovaFicha", id, setData, setErro);
      const newObj = { ...usuariosFiltrados, temFicha: false };
      apiAuthPut(
        "NewUsuario",
        usuariosFiltrados.id,
        newObj,
        setSuccess,
        setErro
      );
      navigate("/personal-dashboard");
      if (!erro) {
        setMessage("O exercicio foi editado");
        setOpenConfirmation(false);
      }
    }
  };

  const onEditarExercicio = (exercicio, field, value) => {
    const newObj = { ...exercicio, [field]: value };
    apiAuthPut("ExercicioRecord", exercicio.id, newObj, setSuccess, setErro);
    if (!erro) {
      setMessage("O exercicio foi editado");
      setOpenConfirmation(true);
    }
  };

  useEffect(() => {
    apiGetById("NovaFicha", id, setData, setErro);
    apiAuthGet("ExercicioRecord/ExercicioRecord", setExercicios, setErro);
    apiAuthGet("NewUsuario", setUsers, setErro);
  }, [exercicios, exerciciosFiltrados]);

  return (
    <div className="p-8">
      <Link
        to="/personal-dashboard"
        className="flex items-center mb-4 text-gray-600 hover:text-gray-800"
      >
        <ChevronLeft className="w-6 h-6 mr-2" />
        Voltar ao Dashboard
      </Link>
      <h1 className="text-3xl font-semibold mb-4">Lista de Exercícios</h1>
      {exerciciosFiltrados?.map((ex) => (
        <Card key={ex.id} className="mb-4">
          <CardContent className="flex flex-col gap-4">
            <Typography variant="h5" component="div" className="font-semibold">
              <span
                id={`${ex.exercicio}`}
                contentEditable={true}
                className="p-2 mr-2 cursor-pointer"
                onBlur={(e) =>
                  onEditarExercicio(ex, "exercicio", e.target.innerText)
                }
              >
                {ex.exercicio}
              </span>{" "}
              <IconButton
                color="primary"
                onClick={() => {
                  const spanElement = document.getElementById(
                    `${ex.exercicio}`
                  );
                  if (spanElement) spanElement.focus();
                }}
              >
                <Pencil style={{ width: '18px', height: '18px' }}/>
              </IconButton>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Repetições:{" "}
              <span
                id={`repeticoes-${ex.repeticoes}`}
                contentEditable={true}
                className="p-2 mr-2 cursor-pointer"
                onBlur={(e) =>
                  onEditarExercicio(ex, "repeticoes", e.target.innerText)
                }
              >
                {ex.repeticoes}
              </span>{" "}
              segundos
              <IconButton
                color="primary"
                onClick={() => {
                  const spanElement = document.getElementById(
                    `repeticoes-${ex.repeticoes}`
                  );
                  if (spanElement) spanElement.focus();
                }}
              >
                <Pencil style={{ width: '18px', height: '18px' }}/>
              </IconButton>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intervalo:{" "}
              <span
                id={`intervalo-${ex.id}`}
                contentEditable={true}
                className="p-2 mr-2 cursor-pointer"
                onBlur={(e) =>
                  onEditarExercicio(ex, "intervalo", e.target.innerText)
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
                <Pencil style={{ width: '18px', height: '18px' }}/>
              </IconButton>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Carga:{" "}
              <span
                id={`carga-${ex.id}`}
                contentEditable={true}
                className="p-2 mr-2 cursor-pointer"
                onBlur={(e) =>
                  onEditarExercicio(ex, "carga", e.target.innerText)
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
                <Pencil style={{ width: '18px', height: '18px' }}/>
              </IconButton>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Anotações: {""}
              {ex.anotacoes}
            </Typography>
          </CardContent>
          <div className="flex gap-2 p-4">
            <IconButton color="error" onClick={() => onExcluirExercicio(ex.id)} sx={{ fontSize: '17px' }}>
              <Trash2 style={{ width: '18px', height: '18px' }}/> Excluir
            </IconButton>
          </div>
        </Card>
      ))}
      <Snackbar
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
        open={openConfirmation}
        autoHideDuration={3000}
        onClose={() =>
          setTimeout(() => {
            setOpenConfirmation(false);
          }, 3000)
        }
      >
        {!erro ? (
          <div className="bg-green-500 text-white p-4 rounded flex items-center">
            <CheckCircle className="w-6 h-6 mr-2" />
            {message} com sucesso!
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

export default DetalhesFicha;
