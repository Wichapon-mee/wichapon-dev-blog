import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavBar, Footer } from './components/NavBar';
import HomePage from './pages/HomePage';
import ViewPostPage from './pages/ViewPostPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <div style={{
      background: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <Routes>
        <Route
          path="/"
          element={(
            <>
              <NavBar />
              <HomePage />
              <Footer />
            </>
          )}
        />
        <Route path="/post/:postId" element={<ViewPostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
