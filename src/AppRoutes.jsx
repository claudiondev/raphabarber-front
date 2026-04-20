import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthGuard from './AuthGuard';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Agendamento from './pages/Agendamento';
import Cadastro from './pages/Cadastro';
import DashboardAdmin from './pages/DashboardAdmin';
import MeusAgendamentos from './pages/MeusAgendamentos';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/agendamento" element={
          <AuthGuard>
            <Agendamento />
          </AuthGuard>
        } />
        <Route path="/meus-agendamentos" element={
          <AuthGuard>
            <MeusAgendamentos />
          </AuthGuard>
        } />

        <Route path="/dashboard" element={
          <AuthGuard role="ADMIN">
            <DashboardAdmin />
          </AuthGuard>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}