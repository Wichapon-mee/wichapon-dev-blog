import React from 'react';
import { Link } from 'react-router-dom';
import { NavBar, Footer } from '@/components/NavBar';

function NotFoundPage() {
  return (
    <div className="not-found-layout">
      <NavBar />

      <main className="not-found-main">
        <div className="not-found-icon" aria-hidden="true">
          !
        </div>
        <h1 className="not-found-title">Page Not Found</h1>
        <Link to="/" className="not-found-home-btn">
          Go To Homepage
        </Link>
      </main>

      <Footer />
    </div>
  );
}

export default NotFoundPage;
