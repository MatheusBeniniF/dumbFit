import React, { useState } from "react";
import { useQuery } from "../useQuery";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../auth";
import logo from "../images/logo.jpg";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  let redirecionarPara = query.get("redirect");

  if (!redirecionarPara) {
    redirecionarPara = "/";
  }

  const sucesso = (result) => {
    console.log(result);
    navegar();
  };

  const erro = (e) => {
    setError(e.response.data);
  };

  const logar = (e) => {
    e.preventDefault();
    login(email, senha, sucesso, erro);
  };

  const navegar = () => {
    const role = localStorage.getItem("usuario_permissao");
    role === "Admin"
      ? navigate("/personal-dashboard")
      : navigate("/cliente-dashboard");
  };

  const toggleIsPasswordVisible = () =>
    setIsPasswordVisible(!isPasswordVisible);

  return (
    <div className="bg-[#cfcfcf] flex flex-col items-center">
      <img className="flex items-center w-80 h-1/2" src={logo} alt="logo" />
      <div className="w-full">
        <h1 className="flex justify-center items-center mb-4 text-4xl font-extrabold">
          Login
        </h1>
        <div className="flex justify-center mb-4">
          <p>Ainda não é cadastrado? </p>
          <Link className="ml-2 text-blue-500" to={"/cadastro"}>
            Cadastre-se
          </Link>
        </div>
        <form className="flex flex-col items-center w-full mb-[400px]">
          <input
            type="email"
            className="rounded-full pl-4  mb-4 outline-none w-4/5 h-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            name="email"
            aria-describedby="emailHelp"
            placeholder="Entre com o e-mail"
          />
          <div className="flex w-4/5">
            <input
              type={isPasswordVisible ? "text" : "password"}
              className="outline-none rounded-full pl-4 pr-12 mb-4 w-full h-10 relative"
              onChange={(e) => setSenha(e.target.value)}
              id="senha"
              name="senha"
              placeholder="Digite a sua senha"
            />
            <button
              className="relative transition-200"
              tabIndex={-1}
              type="button"
              onClick={() => toggleIsPasswordVisible()}
            >
              {isPasswordVisible ? (
                <EyeOff className="absolute right-4 top-2.5" />
              ) : (
                <Eye className="absolute right-4 top-2.5" />
              )}
            </button>
          </div>
          {error.length ? <p className="text-red-500 mb-4">{error}</p> : ""}
          <button
            type="submit"
            className="bg-[#333] text-white rounded-full pl-4  w-4/5 h-10"
            onClick={logar}
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
