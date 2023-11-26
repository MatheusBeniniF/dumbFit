import React, { useEffect, useState } from "react";
import {
  apiGet,
  apiAuthDelete,
  checarAutenticacao,
  apiAuthPost,
} from "../apis";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./Logout";
import UserCard from "./UserCard";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {
  X,
  PlusIcon,
  CheckCircle,
  XCircle,
  Siren,
  Filter,
  FilterX,
} from "lucide-react";
import FichaFormDialog from "./FichaFormDialog";
import { Snackbar } from "@mui/material";

const PersonalDashboard = () => {
  const [data, setData] = useState();
  const [erro, setError] = useState("");
  const [, setSuccess] = useState("");
  const [requerimentos, setRequerimentos] = useState();
  const [user, setUser] = useState("");
  const [open, setOpen] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [membro, setMembro] = useState("");
  const [id, setId] = useState();
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);
  const [filtroAtivo, setFiltroAtivo] = useState(false);

  const filterAlphabetically = () => {
    const members = [...data]
      ?.filter((result) => result.role === "Member")
      .sort((a, b) => a.email.localeCompare(b.email));

    setFilteredData(members);
    setFiltroAtivo(true);
  };

  const resetFilter = () => {
    setFiltroAtivo(false);
  };

  const redirect = (route) => {
    navigate(route);
  };

  const removerRequisicao = async (id) => {
    await apiAuthDelete("RequerirNovaFicha", id, setSuccess, setError);
    if (!erro) {
      setOpenConfirmation(true);
      setMensagem("Removido");
    }
  };

  const addFicha = (requerimento) => {
    setMembro(requerimento.email);
    setId(requerimento.id);
    setMostrarForm(true);
  };

  const onClose = () => {
    setMostrarForm(!mostrarForm);
  };

  const onAddFicha = async (obj) => {
    const newObj = { ...obj, user: membro };
    await apiAuthPost("NovaFicha/Ficha", newObj, setSuccess, setError);

    if (!erro) {
      setOpenConfirmation(true);
      setMensagem("Ficha criada");
      await apiAuthDelete("RequerirNovaFicha", id, setSuccess, setError);
      setOpen(false);
    }
  };

  useEffect(() => {
    apiGet("NewUsuario", setData, setError);
    apiGet("RequerirNovaFicha", setRequerimentos, setError);
    checarAutenticacao(redirect);
    setUser(localStorage.getItem("usuario_nome"));
    const userRole = localStorage.getItem("usuario_permissao");
    userRole === "Member" && redirect("/cliente-dashboard");
  }, [requerimentos]);

  return (
    <div className="p-10">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-black font-extrabold text-5xl">
            PERSONAL DASHBOARD
          </h1>
          <div className="flex items-center gap-4">
            <div className="filter-button bg-white hover:bg-blue-200 text-white py-2 px-4 rounded">
              <Button
                color="primary"
                onClick={() => {
                  filterAlphabetically();
                }}
              >
                Filtrar A-Z
                <span className="ml-2">
                  <Filter />
                </span>
              </Button>
            </div>
            <div className="clear-filter-button bg-white hover:bg-red-200 text-white py-2 px-4 rounded">
              <Button
                color="error"
                onClick={() => {
                  resetFilter();
                }}
              >
                Remover
                <span className="ml-2">
                  <FilterX />
                </span>
              </Button>
            </div>
            {requerimentos?.some((requerimento) =>
              requerimento.personalEmail.includes(user)
            ) && (
              <div className="flex items-center gap-4 bg-white hover:bg-red-200 text-red-800 py-2 px-4 rounded">
                <Button color="error" onClick={() => setOpen(true)}>
                  Requisições
                  <span className="ml-2">
                    <Siren />
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>
        <p className="text-gray-800 font-bold text-lg my-2">
          Usuários cadastrados
        </p>
        {filtroAtivo
          ? filteredData.map((member) => (
              <UserCard key={member.id} member={member} />
            ))
          : data
              ?.filter((result) => result.role === "Member")
              .map((member) => <UserCard key={member.id} member={member} />)}
        <Dialog
          className="rounded-md"
          open={open}
          onClose={() => setOpen(false)}
        >
          <DialogTitle>Requisições para criar ficha</DialogTitle>
          <DialogContent>
            {requerimentos
              ?.filter((requerimento) =>
                requerimento.personalEmail.includes(user)
              )
              .map((requerimento) => (
                <div
                  key={requerimento.id}
                  className="flex items-center gap-4 justify-between p-2 border-b border-gray-300"
                >
                  <p>{requerimento.email} solicitou criar ficha</p>
                  <div>
                    <Button
                      color="error"
                      onClick={() => removerRequisicao(requerimento.id)}
                    >
                      <X />
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => addFicha(requerimento)}
                    >
                      <PlusIcon />
                    </Button>
                  </div>
                  <FichaFormDialog
                    open={mostrarForm}
                    onClose={onClose}
                    onAddFicha={onAddFicha}
                    member={requerimento}
                  />
                </div>
              ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="error">
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
        <LogoutButton />
      </div>
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
            {mensagem} com sucesso!
          </div>
        ) : (
          <div className="bg-red-500 text-white p-4 rounded flex items-center">
            <XCircle className="w-6 h-6 mr-2" />
            Algo deu errado, tente novamente!
          </div>
        )}
      </Snackbar>
      {erro && <p className="text-red-500 mb-4">{erro.response?.data}</p>}
    </div>
  );
};

export default PersonalDashboard;
