'use client'

import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import ThumbnailDisplay from "../../components/ThumbnailDisplay";

export default function AudioUpload({avatars}) {
    const router = useRouter();

    const [audioFile, setAudioFile] = useState(null);
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [uploading, setUploading] = useState(false)
    const [currentSession, setCurrentSession] = useState({});

    useEffect(() => {
        console.log(selectedAvatar);
    }, [selectedAvatar]);


    useEffect(() => {
        // Fetching assets from the server
        console.log("fetching...")
        const fetchCurrentAssets = async () => {
            try {
                const response = await fetch('http://localhost:5050/get-session');
                if (!response.ok) {
                    throw new Error('Failed to fetch assets');
                }
                const data = await response.json();
                console.log(data)
                setCurrentSession(data);
            } catch (error) {
                console.error('Error fetching assets:', error);
                // Handle error accordingly
            }
        };

        fetchCurrentAssets().then(r => {
        });
    }, []);


    const handleAudioFileChange = (event) => {
        setAudioFile(event.target.files[0]); // Set the selected audio file
    };

    const handleAvatarChange = (avatar) => {
        setSelectedAvatar(avatar); // Set the selected avatar
    };

    const handleSubmit = async (event) => {
        setUploading(true)

        event.preventDefault();
        if (audioFile && selectedAvatar) {
            const formData = new FormData();
            formData.append('audio_file', audioFile);
            formData.append('avatar_name', selectedAvatar);

            try {
                const response = await fetch('http://localhost:5050/attach-audio', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();
                console.log(result); // Log or handle the response from the server
                router.push('/');
            } catch (error) {
                console.error('Error uploading the audio:', error);
            }
        } else {
            console.log("No audio file selected or avatar chosen.");
        }
    };

    const handleGoBack = () => {
        router.push('/');
    };


    if (currentSession['avatars'] && Object.keys(currentSession['avatars']).length) {

        console.log(currentSession['avatars'])
        const avatars = currentSession['avatars']

        return (
            <div >
                <div className="add-audio flex justify-center items-start p-9">
                    <img className='mr-7 mt-3 w-1/12 hover:cursor-pointer' src='/assets/Arrow_left.svg'alt='arrow icon' onClick={handleGoBack}/>
                    <div>
                        <h1>Upload Audio for Avatar</h1>
                        <h2>Select Avatar</h2>
                        <div className='upload-col grid mt-7 gap-4'>
                            {Object.entries(currentSession['avatars']).map(([avatar, value], index) => (
                                value?.thumbnail ? (
                                    <div key={index}
                                         onClick={() => handleAvatarChange(avatar)}
                                         className={`cursor-pointer p-1 ${selectedAvatar === avatar ? 'border-4 border-fuchsia-500' : 'border border-transparent hover:border-slate-400 '}`}>
                                        <ThumbnailDisplay name={value.thumbnail}/>
                                    </div>
                                ) : null
                            ))}
                        </div>
                        <h2 className='mt-3'>Select Audio</h2>
                        <input type="file" accept="audio/*" onChange={handleAudioFileChange} style={{display: 'none'}}/>
                        <div className='flex items-center'>
                            <button className="add-btn px-3 py-1 mt-3 mr-5"
                                    onClick={() => document.querySelector('input[type="file"]').click()}>
                                Select File
                            </button>
                            {audioFile && <h2>{audioFile.name}</h2>}
                        </div>

                        <button onClick={handleSubmit} className='add-btn px-3 py-1 mt-5'>Submit</button>


                        {uploading === true ? <div className="flex mt-3 min-h-screen">
                            <div className="text-xl font-semibold text-gray-100">
                                Uploading...
                                <span
                                    className="animate-ping absolute h-3 w-3 rounded-full bg-blue-100 opacity-75"></span>
                            </div>
                        </div> : <h2></h2>}
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <h1>You must upload avatars before you can attach audio to them</h1>
                <button onClick={handleGoBack} style={{marginTop: '20px'}}>Back</button>
            </div>

        )
    }
}
