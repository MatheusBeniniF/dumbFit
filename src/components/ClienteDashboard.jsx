import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut } from "../apis";
import ExercicioCard from "./ExercicioCard";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./Logout";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  ListItemText,
  Snackbar,
} from "@mui/material";
import { CheckCircle, Dumbbell, Plus, XCircle } from "lucide-react";

const ClienteDashboard = () => {
  const [exercicios, setExercicios] = useState();
  const [fichas, setFichas] = useState();
  const [exercicioErro, setExercicioErro] = useState("");
  const [fichaErro, setFichaErro] = useState("");
  const [user, setUser] = useState("");
  const [data, setData] = useState();
  const [, setError] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [, setSucesso] = useState();
  const [erro, setErro] = useState();

  const redirect = (route) => {
    navigate(route);
  };

  const onRequestNovaFicha = async () => {
    await apiGet("NewUsuario", setData, setError);
    setOpen(true);
  };

  useEffect(() => {
    apiGet("ExercicioRecord/ExercicioRecord", setExercicios, setExercicioErro);
    apiGet("NovaFicha", setFichas, setFichaErro);
    apiGet("NewUsuario", setData, setError);

    setUser(localStorage.getItem("usuario_nome"));

    const userRole = localStorage.getItem("usuario_permissao");
    userRole === "Admin" && redirect("/personal-dashboard");
  }, [exercicios, data]);

  const handleUserSelect = (admin) => {
    const newObj = { email: user, personalEmail: admin };
    apiPost("RequerirNovaFicha/RequerirNovaFicha", newObj, setSucesso, setErro);
    setOpen(false);
    setOpenConfirmation(true);
  };

  const handleFinalizarFicha = (ficha) => {
    const fichasUsuario = fichas.filter((f) => f.user.includes(user));

    const indexFichaAtual = fichasUsuario.findIndex((f) => f.id === ficha.id);
    const proximoIndex = (indexFichaAtual + 1) % fichasUsuario.length;

    const fichaAtualizada = { ...ficha, sugestao: false };
    apiPut("NovaFicha", ficha.id, fichaAtualizada, setSucesso, setErro);

    const proximaFicha = fichasUsuario[proximoIndex];
    const proximaFichaAtualizada = { ...proximaFicha, sugestao: true };
    apiPut(
      "NovaFicha",
      proximaFicha.id,
      proximaFichaAtualizada,
      setSucesso,
      setErro
    );
  };

  return (
    <div className="p-10 flex flex-col gap-2">
      {fichas?.some((ficha) => ficha.user.includes(user)) && (
        <h2 className="text-black font-extrabold text-5xl capitalize mb-4">
          Suas fichas
        </h2>
      )}
      {fichas?.map(
        (ficha, index) =>
          ficha.user.includes(user) && (
            <div
              key={index}
              className="flex flex-col gap-4 border-2 p-2 border-black rounded-xl"
            >
              <div className="flex justify-between">
                <h1 className="text-black font-extrabold text-3xl capitalize">
                  {ficha?.titulo}
                </h1>
                {ficha.sugestao === true && (
                  <p className="text-green-500 font-semibold p-2 bg-white items-center rounded-md flex">
                    Sugestão
                  </p>
                )}
              </div>
              <p className="text-gray-800 font-bold text-lg">
                Lista de exercícios
              </p>
              <ExercicioCard
                key={index}
                ficha={ficha}
                exercicios={exercicios}
                user={user}
                error={exercicioErro}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleFinalizarFicha(ficha)}
              >
                Finalizar Ficha
              </button>
            </div>
          )
      )}
      {fichas?.every((ficha) => !ficha.user.includes(user)) && (
        <div className="p-20">
          <div className="flex flex-col items-center justify-center h-40 bg-white rounded-lg">
            <p className="text-gray-900 font-bold text-lg mb-4">
              Usuario sem ficha cadastrada
            </p>
            <button
              onClick={onRequestNovaFicha}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-800"
            >
              Solicitar Nova Ficha
            </button>
          </div>
          <div className="flex place-content-center mt-8">
            <Dumbbell style={{ width: '500px', height: '500px', opacity: '0.3' }}/>
          </div>
        </div>
      )}
      <Dialog open={open} onClose={() => setOpen(!open)}>
        <DialogTitle>Escolha um personal para fazer sua ficha</DialogTitle>
        {data
          ?.filter((result) => result.role === "Admin")
          .map((admin) => (
            <div className="mx-6 my-2 flex items-center justify-between">
              <ListItemText key={admin.id} primary={admin.email} />
              <Button
                color="primary"
                onClick={() => handleUserSelect(admin.email)}
              >
                <Plus />
              </Button>
            </div>
          ))}
        <DialogActions>
          <Button onClick={() => setOpen(!open)} color="error">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
        open={openConfirmation}
        autoHideDuration={3000}
        onClose={() => setOpenConfirmation(false)}
      >
        {!erro ? (
          <div className="bg-green-500 text-white p-4 rounded flex items-center">
            <CheckCircle className="w-6 h-6 mr-2" />
            Sucesso!
          </div>
        ) : (
          <div className="bg-red-500 text-white p-4 rounded flex items-center">
            <XCircle className="w-6 h-6 mr-2" />
            Algo deu errado, tente novamente!
          </div>
        )}
      </Snackbar>
      <LogoutButton />
    </div>
  );
};

export default ClienteDashboard;
