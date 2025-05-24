import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function CriarTabelaDialog({ open, onClose, onCriarTabela }) {
  const [nomeTabela, setNomeTabela] = useState("");
  const [nomesColunas, setNomesColunas] = useState([""]);

  const handleNomeColunaChange = (index, event) => {
    const novosNomesColunas = [...nomesColunas];
    novosNomesColunas[index] = event.target.value;
    setNomesColunas(novosNomesColunas);
  };

  const handleAdicionarCampoColuna = () => {
    setNomesColunas([...nomesColunas, ""]);
  };

  const handleRemoverCampoColuna = (index) => {
    const novosNomesColunas = nomesColunas.filter((_, i) => i !== index);
    setNomesColunas(novosNomesColunas);
  };

  const handleSubmit = () => {
    const colunasFiltradas = nomesColunas
      .map((nome) => nome.trim())
      .filter((nome) => nome !== "");
    if (!nomeTabela.trim()) {
      alert("Por favor, insira um nome para a tabela.");
      return;
    }
    if (colunasFiltradas.length === 0) {
      alert("Por favor, defina pelo menos uma coluna.");
      return;
    }
    onCriarTabela(nomeTabela.trim(), colunasFiltradas);
    handleClose();
  };

  const handleClose = () => {
    setNomeTabela("");
    setNomesColunas([""]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (e) => {
          e.preventDefault();
          handleSubmit();
        },
      }}
    >
      <DialogTitle>Criar Nova Tabela</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Defina o nome da sua nova tabela e os nomes das colunas.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="nomeTabela"
          label="Nome da Tabela"
          type="text"
          fullWidth
          variant="outlined"
          value={nomeTabela}
          onChange={(e) => setNomeTabela(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle1" gutterBottom>
          Colunas:
        </Typography>
        {nomesColunas.map((nomeColuna, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <TextField
              required
              margin="dense"
              label={`Nome da Coluna ${index + 1}`}
              type="text"
              fullWidth
              variant="outlined"
              value={nomeColuna}
              onChange={(e) => handleNomeColunaChange(index, e)}
            />
            {nomesColunas.length > 1 && (
              <IconButton
                onClick={() => handleRemoverCampoColuna(index)}
                color="error"
                sx={{ ml: 1 }}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAdicionarCampoColuna}
          sx={{ mt: 1 }}
        >
          Adicionar Coluna
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button type="submit">Criar Tabela</Button>{" "}
      </DialogActions>
    </Dialog>
  );
}
