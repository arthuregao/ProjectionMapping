'use client'

import {useRouter} from 'next/navigation'
import React, {useState} from 'react';
import "../../style.css";

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
        <div className='flex flex-col mt-9 items-center justify-center'>
            <h1>Upload image</h1>
            <div className='flex justify-start'>
                <img src='/assets/Arrow_left.svg' alt='arrow icon' onClick={handleGoBack}/>
                <form className='flex flex-col items-end upload-img' onSubmit={handleSubmit}>
                    <input className='mb-4' type="file" onChange={handleFileChange}/>
                    <button className='add-btn px-4 py-2' type="submit">Upload Image</button>
                </form>
            </div>
        </div>
    );
}