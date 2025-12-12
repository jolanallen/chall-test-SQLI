  import React from 'react';
  import { Link } from 'react-router-dom';
  import { useAuth } from '../context/AuthContext';

  function Navbar() {
    const { user, logout } = useAuth();

    return (
      <nav>
        <Link to="/">Home</Link>
        {user && user.role === 'ADMIN' && (
          <Link to="/admin">Admin Zone</Link>
        )}
        {user && (user.role === 'PUBLISHER' || user.role === 'ADMIN') && (
          <Link to="/write">Write Post</Link>
        )}
        {user && (
          <>
          <Link to="/feed">Feed</Link> 
          <Link to="/publishers">Publishers</Link> 
          <Link to="/update-profile">Profile</Link> 
          </>
        )}
        {user ? (
          <>
            <span>Welcome, {user.useername}!</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    );
  }

  export default Navbar;
