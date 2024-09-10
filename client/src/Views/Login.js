import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Main from '../Components/Main';


export default function Login({ login }) {
  const [emailAndPassword, setEmailAndPassword] = useState({
    email: '',
    password: ''
  });



  function handleInputChange(e) {
    setEmailAndPassword({
      ...emailAndPassword,
      [e.target.name]: e.target.value
    });
  }

  
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(emailAndPassword.email, emailAndPassword.password);
    } catch (error) {
      console.log(error);
    }
  }

  
  return (
    <Main center>
      <div className="FormContainer">
        <h1 className="Form__titulo">CHAT MERN</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="Form__field"
              required
              onChange={handleInputChange}
              value={emailAndPassword.email}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="Form__field"
              required
              onChange={handleInputChange}
              value={emailAndPassword.password}
            />
            <button type="submit" className="Form__submit">
              Login
            </button>
            <p className="FormContainer__info">
              No account? <Link to="/signup">Signup</Link>
            </p>
          </form>
        </div>
      </div>
    </Main>
  );
}