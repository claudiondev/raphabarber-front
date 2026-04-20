import React from 'react';
import { Navigate } from 'react-router-dom';


 // AuthGuard protege rotas privadas verificando a presença do Token JWT.
 // Também pode verificar se o usuário possui a role necessária. 
const AuthGuard = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const usuarioRole = localStorage.getItem('usuarioRole');

  // Se a rota exige uma permissão específica (ex: ADMIN) e o usuário não a tem 
  if (!token) {
    // Redireciona para a home ou agendamento caso não tenha permissão

    return <Navigate to="/login" replace />;
  }

  if (role && usuarioRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthGuard;