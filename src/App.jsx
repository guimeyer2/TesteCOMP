/* eslint-disable no-unused-vars */
import "./App.css";
import React, { useState, useEffect } from "react";
import CriarTabelaDialog from "./componentes/CriarTabelaDialog";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";

const CHAVE_ARMAZENAMENTO_LOCAL = "tabelasUser";

export default function App() {
  // armazena as tabelas
  const [tabelasUsuario, setTabelasUsuario] = useState([]);
  // indica a tabela ativa
  const [idTabelaAtiva, setIdTabelaAtiva] = useState(null);
  const [carregado, setCarregado] = useState(false);
  const [dialogCriarTabelaAberto, setDialogCriarTabelaAberto] = useState(false);

  useEffect(() => {
    try {
      const tabelasSalvas = localStorage.getItem(CHAVE_ARMAZENAMENTO_LOCAL);
      if (tabelasSalvas) {
        const tabelasParseadas = JSON.parse(tabelasSalvas);
        if (Array.isArray(tabelasParseadas)) {
          setTabelasUsuario(tabelasParseadas);
          if (tabelasParseadas.length > 0 && !idTabelaAtiva) {
            //coloca a primeira tabela como ativa se nao tiver outra selecionada

            const primeiraTabelaValida = tabelasParseadas[0]?.id || null;
            setIdTabelaAtiva(primeiraTabelaValida);
          } else if (
            idTabelaAtiva &&
            !tabelasParseadas.find((t) => t.id === idTabelaAtiva)
          ) {
            setIdTabelaAtiva(tabelasParseadas[0]?.id || null);
          }
        }
      }
    } catch (error) {
      console.error("Falha ao carregar tabelas do localStorage", error);
      setTabelasUsuario([]);
    }
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (carregado) {
      localStorage.setItem(
        CHAVE_ARMAZENAMENTO_LOCAL,
        JSON.stringify(tabelasUsuario)
      );
    }
  }, [tabelasUsuario, carregado]);

  const handleAbrirDialogCriarTabela = () => {
    setDialogCriarTabelaAberto(true);
  };

  const handleFecharDialogCriarTabela = () => {
    setDialogCriarTabelaAberto(false);
  };
  // não acho que ainda seja necessário
  const handleCriarTabela = (nomeTabela, nomesDasColunas) => {
    if (!nomeTabela || !nomeTabela.trim() || nomesDasColunas.length === 0) {
      console.error("Nome da tabela ou colunas inválidos.");
      return;
    }

    const colunasParaSalvar = nomesDasColunas.map((nome, index) => ({
      id: `col-${Date.now()}-${index}`,
      name: nome,
      type: "text",
    }));

    const linhaInicial = {
      id: `row-initial-${Date.now()}`,
    };
    colunasParaSalvar.forEach((coluna) => {
      linhaInicial[coluna.id] = "";
    });

    const novaTabela = {
      id: `tabela-${Date.now()}`,
      name: nomeTabela,
      columns: colunasParaSalvar,
      rows: [linhaInicial],
    };

    setTabelasUsuario((tabelasAnteriores) => [
      ...tabelasAnteriores,
      novaTabela,
    ]);
    setIdTabelaAtiva(novaTabela.id);
  };

  // fubnções a serem implementadas
  const handleAdicionarColunaNaTabela = (
    idDaTabela,
    nomeColuna,
    tipoColuna = "text"
  ) => {
    console.log(
      `TODO: Adicionar coluna "${nomeColuna}" (tipo: ${tipoColuna}) à tabela ${idDaTabela}`
    );
    setTabelasUsuario((prevTabelas) =>
      prevTabelas.map((tabela) => {
        if (tabela.id === idDaTabela) {
          const novaColuna = {
            id: `col-${Date.now()}`,
            name: nomeColuna,
            type: tipoColuna,
          };

          const colunasAtualizadas = [...tabela.columns, novaColuna];

          const linhasAtualizadas = tabela.rows.map((linha) => ({
            ...linha,
            [novaColuna.id]: "",
          }));
          return {
            ...tabela,
            columns: colunasAtualizadas,
            rows: linhasAtualizadas,
          };
        }
        return tabela;
      })
    );
  };

  const handleAdicionarLinhaNaTabela = (idDaTabela, dadosLinha) => {
    console.log(`TODO: Adicionar linha à tabela ${idDaTabela}:`, dadosLinha);
    setTabelasUsuario((prevTabelas) =>
      prevTabelas.map((tabela) => {
        if (tabela.id === idDaTabela) {
          const novaLinhaCompleta = { id: `row-${Date.now()}` };
          tabela.columns.forEach((col) => {
            novaLinhaCompleta[col.id] = dadosLinha[col.id] || "";
          });
          return { ...tabela, rows: [...tabela.rows, novaLinhaCompleta] };
        }
        return tabela;
      })
    );
  };

  const handleRemoverLinhaDaTabela = (idDaTabela, idLinha) => {
    console.log(`TODO: Remover linha ${idLinha} da tabela ${idDaTabela}`);
    setTabelasUsuario((prevTabelas) =>
      prevTabelas.map((tabela) => {
        if (tabela.id === idDaTabela) {
          const linhasFiltradas = tabela.rows.filter(
            (linha) => linha.id !== idLinha
          );
          return { ...tabela, rows: linhasFiltradas };
        }
        return tabela;
      })
    );
  };

  const tabelaAtiva = tabelasUsuario.find(
    (tabela) => tabela.id === idTabelaAtiva
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "auto" }}>
      {" "}
      <Typography variant="h4" component="h1" gutterBottom>
        Table Maker
      </Typography>
      <Button
        variant="contained"
        onClick={handleAbrirDialogCriarTabela}
        sx={{ mb: 3 }}
      >
        Criar Nova Tabela
      </Button>
      <CriarTabelaDialog
        open={dialogCriarTabelaAberto}
        onClose={handleFecharDialogCriarTabela}
        onCriarTabela={handleCriarTabela}
      />
      <Box sx={{ display: "flex", gap: 3 }}>
        <Paper
          elevation={3}
          sx={{ width: "30%", p: 2, maxHeight: "70vh", overflow: "auto" }}
        >
          <Typography variant="h6" gutterBottom>
            Tabelas Criadas:
          </Typography>
          {tabelasUsuario.length === 0 ? (
            <Typography variant="body2">
              Nenhuma tabela criada ainda.
            </Typography>
          ) : (
            <List>
              {tabelasUsuario.map((tabela) => (
                <ListItem key={tabela.id} disablePadding>
                  <ListItemButton
                    selected={tabela.id === idTabelaAtiva}
                    onClick={() => setIdTabelaAtiva(tabela.id)}
                  >
                    <ListItemText
                      primary={tabela.name}
                      secondary={`${tabela.columns.length} colunas, ${tabela.rows.length} linhas`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        <Paper
          elevation={3}
          sx={{ width: "70%", p: 2, maxHeight: "70vh", overflow: "auto" }}
        >
          {tabelaAtiva ? (
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Visualizando: {tabelaAtiva.name}
              </Typography>
              <Typography variant="subtitle1">
                Definição das Colunas:
              </Typography>
              <pre
                style={{
                  background: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "4px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {JSON.stringify(tabelaAtiva.columns, null, 2)}
              </pre>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Dados das Linhas:
              </Typography>
              <pre
                style={{
                  background: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "4px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {JSON.stringify(tabelaAtiva.rows, null, 2)}
              </pre>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
              {tabelasUsuario.length > 0
                ? "Selecione uma tabela da lista para ver seus detalhes."
                : "Crie uma nova tabela para começar."}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
