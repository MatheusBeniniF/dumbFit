import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { BookUser, CheckCircle, Plus, XCircle } from "lucide-react";
import FichaFormDialog from "./FichaFormDialog";
import { apiAuthPost } from "../apis";
import { Snackbar } from "@mui/material";
import { Link } from "react-router-dom";

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
            <Link to={`/cliente/${member.id}`}>
              <IconButton
                aria-label="add-ficha"
                className="text-green-500 hover:text-green-800"
                onClick={() => setOpen(true)}
              >
                <BookUser />
                Info
              </IconButton>
            </Link>
          </div>
        </CardContent>
      </Card>
      {erro && <p className="text-red-500 mb-4">{erro.response?.data}</p>}
    </div>
  );
};

export default UserCard;
