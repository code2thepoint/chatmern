import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Axios from 'axios';

import {
  setToken,
  deleteToken,
  getToken,
  initAxiosInterceptors
} from './Helpers/auth-helpers';

import Nav from './Components/Nav';
import Loading from './Components/Loading';
import Signup from './Views/Signup';
import Login from './Views/Login';

import Chatroom from './Views/Chatroom';
import Chat from './Views/Chat';
import Main from './Components/Main';
  
initAxiosInterceptors();

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
 
  useEffect(() => {
    async function loadUser() {
      if (!getToken()) {
        setLoadingUser(false);
        return;
      }
      try {
        const { data: user } = await Axios.get('http://localhost:3000/users/currentuser');
        setUser(user);
        setLoadingUser(false);
      } catch (error) {
        console.log(error);
      }
    }
    loadUser();
  }, []);

  async function login(email, password) {
    const { data } = await Axios.post('http://localhost:3000/users/login', {
      email,
      password
    });
    setUser(data.user);
    setToken(data.token);
  }

  async function signup(user) {
    const { data } = await Axios.post('http://localhost:3000/users/signup', user);
    setUser(data.user);
    setToken(data.token);
  }
  
  function logout() {
    setUser(null);
    deleteToken();
  }

  if (loadingUser) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  return (
    <Router>
      <Nav user={user} logout={logout} />
       {user ? 
       <LoggedInRoutes user={user} logout={logout} navigate={Navigate}/> 
       : <LoggedOutRoutes login={login} signup={signup} />}
    </Router>
  );
}

function LoggedInRoutes({ user, logout }) {
  return (
    <Routes>
      <Route path="/" element={<Chatroom user={user} logout={logout} />} />
      <Route path="/chat/:recepientId" element={<Chat user={user} logout={logout} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function LoggedOutRoutes({ login, signup }) {
  return (
    <Routes>
      <Route path="/login" element={<Login login={login} />} />
      <Route path="/signup" element={<Signup signup={signup} />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}


