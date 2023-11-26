import React, { useEffect, useState } from "react";
import FichaFormDialog from "./FichaFormDialog";
import { useParams, Link } from "react-router-dom";
import { apiAuthPost, apiAuthPut, apiGet, apiGetById } from "../apis";
import FichaCard from "./FichaCard";
import {
  CheckCircle,
  PlusCircle,
  XCircle,
  ChevronLeft,
  Frown,
} from "lucide-react";
import { Button, Snackbar } from "@mui/material";

const DetalhesUsuario = () => {
  const [user, setUser] = useState();
  const [ficha, setFicha] = useState();
  const [exercicios, setExercicios] = useState();
  const [error, setError] = useState();
  const [message, setMessage] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [, setSuccess] = useState();

  const onClose = () => {
    setMostrarForm(!mostrarForm);
  };

  const onAddFicha = async (obj) => {
    const newObj = { ...obj, user: user.email };
    await apiAuthPost("NovaFicha/Ficha", newObj, setSuccess, setError);
    if (!error) {
      setMessage("Ficha criada");
      const finalObj = { ...user, temFicha: true };
      await apiAuthPut("NewUsuario", id, finalObj, setSuccess, setError);
    }
    setOpenConfirmation(true);
  };

  const alterarMensagem = (mensagem) => {
    setMessage(mensagem);
  };

  const { id } = useParams();

  useEffect(() => {
    apiGetById("NewUsuario", id, setUser, setError);
    apiGet("NovaFicha", setFicha, setError);
    apiGet("ExercicioRecord/ExercicioRecord", setExercicios, setError);
      }, [id, user?.temFicha, ficha]);

  return (
    <div className="flex flex-col p-4 m-4">
      <Link
        to="/personal-dashboard"
        className="flex items-center mb-4 text-gray-600 hover:text-gray-800"
      >
        <ChevronLeft className="w-6 h-6 mr-2" />
        Voltar ao Dashboard
      </Link>
      <h2 className="font-bold text-2xl">Detalhes de {user?.email}</h2>

      {user?.temFicha ? (
        <FichaCard
          key={ficha?.id}
          ficha={ficha}
          exercicios={exercicios}
          user={user}
          setMessage={alterarMensagem}
        />
      ) : (
        <div className="p-10">
          <div className="flex flex-col items-center justify-center h-40 bg-white rounded-lg">
            <p className="text-gray-900 font-bold text-lg mb-4">
              Usuario sem ficha
            </p>
            <Frown style={{ width: "30px", height: "30px" }} />
          </div>
        </div>
      )}
      <Button onClick={() => setMostrarForm(true)}>
        <p className="mr-2 font-bold text-lg">Adicionar nova ficha</p>{" "}
        <PlusCircle />
      </Button>
      <FichaFormDialog
        open={mostrarForm}
        onClose={onClose}
        onAddFicha={onAddFicha}
      />
      <Snackbar
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
        open={openConfirmation}
        autoHideDuration={3000}
        onClose={() => setOpenConfirmation(false)}
      >
        {!error ? (
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

export default DetalhesUsuario;
