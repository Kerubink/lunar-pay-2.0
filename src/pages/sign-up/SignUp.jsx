import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import style from "../../styles/style-form-default/StyleFormDefault.module.css"; 
import BackButton from "../../components/back-button/BackButton"; 
import InputForm from "../../components/input-form/InputForm"; 
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ButtonDefault from "../../components/button-default/ButtonDefault"; 
import PersonIcon from '@mui/icons-material/Person';

export default function SignUp() {

  const [formData, setFormData] = useState({
    name: "",
    accountNumber: "",
    email: "",
    password: ""
  });


  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
   setFormData({
      ...formData,
      [e.target.name]: e.target.value
     });
   };


  const handleSubmit = async (e) => {
    e.preventDefault();
     setLoading(true);
     setError("");

    const { name, accountNumber, email, password } = formData;

    console.log("log do formData", formData)

    if (!name || !accountNumber || !email || !password) {
        setError("Todos os campos são obrigatórios.");
        setLoading(false);
        return;
      }

    try {
      const response = await fetch(
        "https://projeto-final-m5-api.onrender.com/api/users",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, accountNumber, email, password }),
        }
      );

      const data = await response.json();

      console.log("resposta da api", data)

      if (response.ok) {
        localStorage.setItem("authToken", data.token); 
        localStorage.setItem("userId", data.userId); 

        console.log("Conta criada com sucesso, redirecionando...");
        navigate("/sign/in"); 
        
      } else {
        setError(data.message || "Falha ao criar a conta, por favor tente novamente.");
      }
    } catch (error) {
      setError("Ocorreu um erro, por favor tente novamente mais tarde.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.container_form}>
      <BackButton to="/" />

      <h1 className={style.title__form}>Cadastro</h1>

      {error && <p className={style.error_message}>{error}</p>} 

      <form onSubmit={handleSubmit}>
        <InputForm
          label="Nome Completo"
          type="text"
          icon={PersonIcon}
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
        />

        <InputForm
          label="Número de Telefone"
          type="text"
          icon={PhoneOutlinedIcon}
          name="accountNumber" 
          value={formData.accountNumber} 
          onChange={handleChange} 
        />

        <InputForm
          label="Email"
          type="email"
          icon={EmailOutlinedIcon}
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
        />

        <InputForm
          label="Senha"
          type="password"
          icon={LockOutlinedIcon}
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
        />

        <ButtonDefault
          name={loading ? "Creating Account..." : "Sign Up"}
          onClick={handleSubmit}
          disabled={loading}
        />
      </form>
      <span className={style.LoginUserDashboard}>
        Já tem uma conta? <a href="/sign/in">Entrar</a>
      </span>
    </div>
  );
}
