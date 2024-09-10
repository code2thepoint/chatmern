import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Main from '../Components/Main';

export default function Signup({ signup }) {
  const [user, setUser] = useState({
    email: '',
    username: '',
    password: '',
 
  });


  function handleInputChange(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  }


  
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await signup(user);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Main center={true}>

      <div className="Signup">
        <div className="FormContainer">
          <h1 className="Form__titulo">CHAT MERN</h1>
          <p className="FormContainer__info">
             
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="Form__field"
              required
              onChange={handleInputChange}
              value={user.email}
            />
        
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="Form__field"
              required
              minLength="3"
              maxLength="30"
              onChange={handleInputChange}
              value={user.username}
            />
         
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="Form__field"
              required
              onChange={handleInputChange}
              value={user.password}
            />
            <button className="Form__submit" type="submit">
              Sign up
            </button>
            <p className="FormContainer__info">
              Already an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </Main>
  );
}