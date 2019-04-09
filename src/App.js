import React, { useState } from 'react';

import './App.css';
import Todo from './components/Todo';
import Header from './components/Header';
import Auth from './components/Auth';
import AuthContext from './components/auth-context';

const app = () => {
  const [page, setPage] = useState('auth');
  const [authStatus, setAuthStatus] = useState(false);

  const switchPage = pageName => {
    setPage(pageName);
  };

  const login = () => {
    setAuthStatus(true);
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ status: authStatus, login: login }}>
        <Header
          onLoadTodos={() => switchPage('todos')}
          onLoadAuth={() => switchPage('auth')}
        />
        <hr />
        {page === 'todos' ? <Todo /> : null}
        {page === 'auth' ? <Auth /> : null}
      </AuthContext.Provider>
    </div>
  );
};

export default app;
