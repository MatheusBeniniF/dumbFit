import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Plus } from "lucide-react";

const FichaFormDialog = ({ open, onClose, onAddFicha }) => {
  const [fichaData, setFichaData] = useState({
    titulo: "",
    exercicios: [
      {
        exercicio: "",
        intervalo: "",
        qtdSeries: "",
        repeticoes: "",
      },
    ],
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (field, value) => {
    setFichaData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleExerciseChange = (index, field, value) => {
    setFichaData((prevData) => ({
      ...prevData,
      exercicios: prevData.exercicios.map((exercise, i) =>
        i === index ? { ...exercise, [field]: value } : exercise
      ),
    }));
  };

  const handleAddExercise = () => {
    setFichaData((prevData) => ({
      ...prevData,
      exercicios: [
        ...prevData.exercicios,
        { exercicio: "", intervalo: 0, qtdSeries: 0, repeticoes: 0 },
      ],
    }));
  };

  const handleRemoveExercise = () => {
    setFichaData((prevData) => {
      const updatedExercicios = [...prevData.exercicios];
      if (updatedExercicios.length > 1) {
        updatedExercicios.pop();
      }

      return {
        ...prevData,
        exercicios: updatedExercicios,
      };
    });

    checkFormValidity();
  };

  const handleAddFicha = () => {
    onAddFicha(fichaData);
    onClose();
  };

  const checkFormValidity = () => {
    const allFieldsFilled = Object.values(fichaData).every(
      (value) => value !== ""
    );

    const exercisesFilled = fichaData.exercicios.every((exercise) =>
      Object.values(exercise).every((value) => value !== "")
    );

    setIsFormValid(allFieldsFilled && exercisesFilled);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Adicionar Nova Ficha</DialogTitle>
      <DialogContent>
        <TextField
          label="Titulo"
          value={fichaData.titulo}
          onChange={(e) => {
            handleInputChange("titulo", e.target.value);
            checkFormValidity();
          }}
          fullWidth
          margin="normal"
        />
        {fichaData.exercicios &&
          fichaData.exercicios.map((exercise, index) => (
            <div key={index}>
              <TextField
                label={`Exercicio ${index + 1}`}
                value={exercise.exercicio}
                onChange={(e) => {
                  handleExerciseChange(index, "exercicio", e.target.value);
                  checkFormValidity();
                }}
                fullWidth
                margin="normal"
              />
              <TextField
                type="number"
                min="0"
                label="Intervalo"
                value={exercise.intervalo}
                onChange={(e) => {
                  handleExerciseChange(index, "intervalo", e.target.value);
                  checkFormValidity();
                }}
                fullWidth
                margin="normal"
              />
              <TextField
                type="number"
                min="0"
                label="Numero de series"
                value={exercise.qtdSeries}
                onChange={(e) => {
                  handleExerciseChange(index, "qtdSeries", e.target.value);
                  checkFormValidity();
                }}
                fullWidth
                margin="normal"
              />
              <TextField
                type="number"
                min="0"
                label="Repetições"
                value={exercise.repeticoes}
                onChange={(e) => {
                  handleExerciseChange(index, "repeticoes", e.target.value);
                  checkFormValidity();
                }}
                fullWidth
                margin="normal"
              />
            </div>
          ))}
        <Button color="error" onClick={handleRemoveExercise}>
          Remover Exercicio
        </Button>
        <Button
          onClick={handleAddExercise}
          startIcon={<Plus />}
          disabled={!isFormValid}
        >
          Adicionar Exercicio
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancelar
        </Button>
        <Button
          onClick={handleAddFicha}
          color="primary"
          disabled={!isFormValid}
        >
          Criar Ficha
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FichaFormDialog;
