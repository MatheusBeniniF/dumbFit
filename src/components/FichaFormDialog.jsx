import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Minus, Plus } from "lucide-react";
import { Checkbox, FormControlLabel } from "@mui/material";

const FichaFormDialog = ({ open, onClose, onAddFicha }) => {
  const [fichaData, setFichaData] = useState({
    titulo: "",
    sugestao: "",
    exercicios: [
      {
        exercicio: "",
        intervalo: "",
        qtdSeries: "",
        repeticoes: "",
        carga: "",
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle
        style={{ backgroundColor: "#000000", color: "#fff", padding: "16px" }}
      >
        NOVA FICHA
      </DialogTitle>
      <DialogContent style={{ backgroundColor: "#f0f0f0", padding: "16px" }}>
        <TextField
          label="Título"
          value={fichaData.titulo}
          onChange={(e) => {
            handleInputChange("titulo", e.target.value);
            checkFormValidity();
          }}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={fichaData.sugestao}
              onChange={(e) => {
                handleInputChange("sugestao", e.target.checked);
                checkFormValidity();
              }}
            />
          }
          label="Sugestao"
        />
        {fichaData.exercicios &&
          fichaData.exercicios.map((exercise, index) => (
            <div key={index}>
              <TextField
                label={`Exercício ${index + 1}`}
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
                label="Número de series"
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
              <TextField
                label="Carga"
                value={exercise.carga}
                onChange={(e) => {
                  handleExerciseChange(index, "carga", e.target.value);
                  checkFormValidity();
                }}
                fullWidth
                margin="normal"
              />
            </div>
          ))}
        <Button
          color="error"
          onClick={handleRemoveExercise}
          startIcon={<Minus />}
        />
        <Button
          onClick={handleAddExercise}
          startIcon={<Plus />}
          disabled={!isFormValid}
        />
      </DialogContent>
      <DialogActions
        style={{
          backgroundColor: "#f0f0f0",
          padding: "16px",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
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
