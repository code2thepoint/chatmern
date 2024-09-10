import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import Axios from 'axios';
import Main from '../Components/Main';

function Chatroom({ user }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadInitialUsers() {
      try {
        const response = await Axios.get('http://localhost:3000/users/hi');
        const newUsers = response.data;
        console.log(newUsers);

        const filteredUsers = newUsers.filter(u => u._id !== user._id);

        setUsers(filteredUsers);
      } catch (error) {
        console.log('There was a problem loading your feed.');
        console.log(error);
      }
    }
    loadInitialUsers();
  }, []);

  return (
    <Main center>
      <div className="UserListScreen">
        <h1>Chatroom</h1>
        <ul className="UserList">
          {users.map(user => (
            <li key={user.id}>
              <Link to={`/chat/${user._id}`} className="UserList__Link">
                {user.username}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Main>
  );
}

export default Chatroom;