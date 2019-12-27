import React from 'react';
import './Navbar.css'
import axios from 'axios'

function Navbar({username, history, setUserData}){
    const handleClick = () => {
        axios.get('/api/users/logout', {withCredentials:true})
        .then(res => {
            if(res.data.loggedIn === false){
                setUserData(res.data);
                history.push('/');
            }
        })
        .catch((err) => console.log(err));
    }
    return(
        <nav className='Navbar'>
            <h1>{username}</h1>
            <button onClick={handleClick}>Log Out</button>
        </nav>
    )
}
export default Navbar;