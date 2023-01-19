import React from 'react';
import PropTypes from 'prop-types';
import '../CurrentItem.css';


async function loginUser(credentials) {
    console.log(JSON.stringify(credentials));
    return fetch('http://' + window.location.hostname + ':4000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify(credentials),
    })
      .then(data => data.json())
   }
   



export default function Login({setToken, setUserName, setPassword, username, password}) {
    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
          username,
          password
        });
        setToken(token);
      }

      
  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUserName(e.target.value)}/>
        </label>
        <label>
          <p>Password</p>
          <input type="text" onChange={e => setPassword(e.target.value)}/>
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}


Login.propTypes = {
    setToken: PropTypes.func.isRequired
  };