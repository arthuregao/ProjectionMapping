'use client'

import {useRouter} from 'next/navigation'
import React, {useState} from 'react';

export default function ImageUpload() {
    const router = useRouter();

    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Set the selected file
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (file) {
            const formData = new FormData();
            formData.append('file', file); // Match the key 'file' with your server endpoint

            try {
                const response = await fetch('http://localhost:5000/upload-image',
                    {
                        method: 'POST',
                        body: formData,
                    });

                const result = await response.json().then(() => {
                    router.push('/')
                });
                console.log(result); // Log or handle the response from the server
            } catch (error) {
                console.error('Error uploading the image:', error);
            }
        } else {
            console.log("No file selected.");
        }
    };

    const handleGoBack = async (event) => {
        event.preventDefault()

        router.push('/')
    }

    return (
        <div>

            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange}/>
                <button className={'p-3 bg-gray-500 hover:bg-gray-400 rounded-md'} type="submit">Upload Image</button>
            </form>

            <button onClick={handleGoBack}>Back</button>
        </div>
    );
}