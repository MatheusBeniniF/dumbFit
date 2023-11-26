import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "../apis";
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
import { CheckCircle, Plus, XCircle } from "lucide-react";

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

  return (
    <div className="p-10">
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
              <ExercicioCard
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
              onClick={onRequestNovaFicha}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-800"
            >
              Solicitar Nova Ficha
            </button>
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
