import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { CheckCircle, Plus, XCircle } from "lucide-react";
import FichaFormDialog from "./FichaFormDialog";
import { apiAuthPost } from "../apis";
import { Snackbar } from "@mui/material";

const UserCard = ({ member }) => {
  const [open, setOpen] = useState(false);
  const [, setSuccess] = useState();
  const [erro, setErro] = useState();
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const onClose = () => {
    setOpen(!open);
  };

  const onAddFicha = (obj) => {
    const newObj = { ...obj, user: member?.email };
    apiAuthPost("NovaFicha/Ficha", newObj, setSuccess, setErro);
    if (!erro) {
      setOpenConfirmation(true);
    }
  };

  return (
    <div className="mb-4">
      <Card className="border border-gray-300 items-center px-4 !rounded-full shadow-md">
        <CardContent className="flex justify-between">
          <Typography color="text.secondary" className="flex items-center">
            {member?.email}
          </Typography>
          <div className="flex justify-end p-4">
            <IconButton
              aria-label="add-ficha"
              className="text-green-500 hover:text-green-800"
              onClick={()=> setOpen(true)}
            >
              <Plus />
            </IconButton>
          </div>
        </CardContent>
      </Card>
      <FichaFormDialog open={open} onClose={onClose} onAddFicha={onAddFicha} />
      <Snackbar
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
        open={openConfirmation}
        autoHideDuration={3000}
        onClose={() => setOpenConfirmation(false)}
      >
        {!erro ? (
          <div className="bg-green-500 text-white p-4 rounded flex items-center">
            <CheckCircle className="w-6 h-6 mr-2" />
            Ficha criada com sucesso!
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

export default UserCard;
