'use client'

import {useRouter} from 'next/navigation';
import React, { useState } from 'react';

function TextSubmitter() {
    const router = useRouter();
    const [text, setText] = useState('');

    const handleInputChange = (event) => {
        setText(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('text', text);

        try {
            const response = await fetch('http://localhost:5000/upload-text', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            router.push('/')
        } catch (error) {
            console.error('Error:', error);
            alert('Error sending data');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Text:
                <textarea
                    className='bg-gray-800 p-3'
                    value={text}
                    onChange={handleInputChange}
                />
            </label>
            <button
                className='bg-gray-800 hover:bg-gray-500'
                type="submit">
                Submit
            </button>
        </form>
    );
}

export default TextSubmitter;
