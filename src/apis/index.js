import axios from "axios";
import { estaAutenticado, getToken } from "../auth";

const urlBase = "http://localhost:5234/api";

const checarAutenticacao = (navigate, locationUrl) => {
  if (!estaAutenticado()) {
    navigate("/login?redirect=" + locationUrl);
  }
};

export const apiPost = (url, objeto, sucesso, erro) => {
  axios
    .post(`${urlBase}/${url}`, objeto)
    .then((result) => {
      sucesso(result.data);
    })
    .catch((error) => {
      erro(error);
    });
};

export const apiAuthGet = (url, sucesso, erro, navigate, locationUrl) => {
  checarAutenticacao(navigate, locationUrl);

  const instance = axios.create({
    baseURL: `${urlBase}`,
    timeout: 1000,
    headers: { Authorization: "Bearer " + getToken() },
  });

  instance
    .get(`/${url}`)
    .then((result) => {
      sucesso(result.data);
    })
    .catch((error) => {
      erro(error);
    });
};

export const apiAuthPost = (url, objeto, sucesso, erro) => {
  checarAutenticacao();

  const instance = axios.create({
    baseURL: `${urlBase}`,
    timeout: 1000,
    headers: { Authorization: "Bearer " + getToken() },
  });

  instance
    .post(`/${url}`, objeto)
    .then((result) => {
      sucesso(result.data);
    })
    .catch((error) => {
      erro(error);
    });
};
