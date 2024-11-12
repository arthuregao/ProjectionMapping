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
                const response = await fetch('http://localhost:5050/upload-image', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();
                router.push('/');
                console.log(result); // Log or handle the response from the server
            } catch (error) {
                console.error('Error uploading the image:', error);
            }
        } else {
            console.log("No file selected.");
        }
    };

    const handleGoBack = () => {
        router.push('/');
    }

    return (
        <div className="add-audio flex justify-center items-start p-9">
            <img className="mr-7 mt-3 w-1/12 hover:cursor-pointer" src="/assets/Arrow_left.svg" alt="arrow icon" onClick={handleGoBack}/>
            <div>
                <h1 className="mb-5">Upload Image</h1>
                <form className="flex flex-col items-start upload-img" onSubmit={handleSubmit}>
                    <input className="mb-4" type="file" onChange={handleFileChange} style={{display: 'none'}}/>
                    <div className='flex items-center'>
                        <button className="add-btn px-3 py-1 mt-3 mr-5"
                                onClick={() => document.querySelector('input[type="file"]').click()}>
                            Select An Image
                        </button>
                        {file && <h2>{file.name}</h2>}
                    </div>
                    <button className="add-btn mt-5 px-4 py-2" type="submit">Upload Image</button>
                </form>
            </div>
        </div>
    );
}
