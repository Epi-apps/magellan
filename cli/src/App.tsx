import React, { useState, useEffect } from 'react';
import Login from './components/Login'
import Home from './components/Home';

function App() {

    const [token, setToken] = useState('');

    useEffect(() => {

        async function getToken() {
            try {
                const response = await fetch('http://localhost:5000/auth/token');
                const json = await response.json();
                setToken(json.access_token);
            } catch (error) {
                console.log(error);
            }
        }

        getToken();

    }, []);

    return (
        <div className='h-screen w-screen bg-black text-white'>
            {(token === '') ? <Login /> : <Home accessToken={token} />}
        </div>
    );
}

export default App;
