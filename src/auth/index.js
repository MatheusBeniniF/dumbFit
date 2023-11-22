import { apiAuthPost, apiPost } from "../apis";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const getToken = () => {
  const token = cookies.get("jwt_auth");
  return token;
};

export const estaAutenticado = () => {
  const token = cookies.get("jwt_auth");

  return token !== null && token !== undefined;
};

export const login = (usuario, senha, sucesso, erro) => {
  apiPost(
    "usuario/login",
    { Email: usuario, Password: senha },
    (result) => {
      const token = result;
      const decoded = jwtDecode(token);

      const { unique_name, roles } = decoded;

      localStorage.setItem("usuario_nome", unique_name);
      localStorage.setItem("usuario_permissao", roles);

      cookies.set("jwt_auth", token, {
        expires: new Date(decoded.exp * 1000), //de segundos para milisegundos
        sameSite: "strict",
      });

      sucesso(unique_name, roles);
    },
    erro
  );
};

export const registrarUsuario = (usuario, senha, admin, sucesso, erro) => {
  if (admin) {
    apiAuthPost(
      "usuario/criaradmin",
      { Email: usuario, Password: senha },
      (result) => {
        const token = result;
        const decoded = jwtDecode(token);

        const { unique_name, roles } = decoded;

        localStorage.setItem("usuario_nome", unique_name);
        localStorage.setItem("usuario_permissao", roles);

        cookies.set("jwt_auth", token, {
          expires: new Date(decoded.exp * 1000), //de segundos para milisegundos
          sameSite: "strict",
        });

        sucesso(unique_name, roles);
      },
      erro
    );
  } else {
    apiPost(
      "usuario/criar",
      { Email: usuario, Password: senha },
      (result) => {
        const token = result;
        const decoded = jwtDecode(token);

        const { unique_name, roles } = decoded;

        localStorage.setItem("usuario_nome", unique_name);
        localStorage.setItem("usuario_permissao", roles);

        cookies.set("jwt_auth", token, {
          expires: new Date(decoded.exp * 1000), //de segundos para milisegundos
          sameSite: "strict",
        });

        sucesso(unique_name, roles);
      },
      erro
    );
  }
};
