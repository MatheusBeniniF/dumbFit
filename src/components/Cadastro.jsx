import React, { useState } from "react";
import { useQuery } from "../useQuery";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../auth";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

const Cadastro = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isUsuarioForm, setIsUsuarioForm] = useState(false);
  const [isPersonalForm, setIsPersonalForm] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState("");

  let redirecionarPara = query.get("redirect");

  if (!redirecionarPara) {
    redirecionarPara = "/";
  }

  const sucesso = (result) => {
    if (result) {
      navegar();
    }
  };

  const erro = (e) => {
    setError(e.response.data);
  };

  const criarUsuario = (e) => {
    e.preventDefault();

    if (isPersonalForm) {
      registrarUsuario(email, senha, true, sucesso, erro);
    } else {
      registrarUsuario(email, senha, false, sucesso, erro);
    }
  };

  const toggleIsPasswordVisible = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const navegar = () => {
    const role = localStorage.getItem("usuario_permissao");
    role === "Admin"
      ? navigate("/personal-dashboard")
      : navigate("/cliente-dashboard");
  };

  const changeForm = (role) => {
    setIsPersonalForm(false);
    setIsUsuarioForm(false);
    role === "personal" ? setIsPersonalForm(true) : setIsUsuarioForm(true);
  };

  const resetValues = () => {
    setIsPersonalForm(false);
    setIsUsuarioForm(false);
  }

  return (
    <div className="bg-[#cfcfcf] flex flex-col ">
      {(!!isUsuarioForm || !!isPersonalForm) && (
        <button
          onClick={resetValues}
          className="flex text-gray-600 hover:text-gray-800 p-8 items-start"
        >
          <ChevronLeft className="w-6 h-6 mr-2" />
          Voltar a tela de escolha
        </button>
      )}
      <div className="w-full p-10 pt-40 items-center">
        <h1 className="flex justify-center items-center mb-4 text-4xl font-extrabold">
          Cadastrar{" "}
          {!!isPersonalForm || !!isUsuarioForm
            ? isPersonalForm
              ? "personal"
              : "usuario"
            : ""}
        </h1>
        {!isPersonalForm && !isUsuarioForm && (
          <div className="flex justify-center items-center text-center gap-5 mb-[655px]">
            <button
              className="bg-black text-white rounded-full pl-4  p-4"
              onClick={() => changeForm("personal")}
            >
              Cadastrar Personal
            </button>
            <button
              className="bg-black text-white rounded-full pl-4  p-4"
              onClick={() => changeForm("usuario")}
            >
              Cadastrar Usuario
            </button>
          </div>
        )}
        {(!!isUsuarioForm || !!isPersonalForm) && (
          <form className="flex flex-col items-center w-full mb-[555px]">
            <input
              type="email"
              className="rounded-full pl-4  mb-4 outline-none w-4/5 h-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              name="email"
              aria-describedby="emailHelp"
              placeholder="Digite seu e-mail"
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
              onClick={criarUsuario}
            >
              Sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Cadastro;
