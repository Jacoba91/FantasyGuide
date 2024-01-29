import React, { useState, useEffect } from 'react';

function TestConnection() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/test')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setMessage(data.message))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <p>Server Message: {message}</p>
        </div>
    );
}

export default TestConnection;