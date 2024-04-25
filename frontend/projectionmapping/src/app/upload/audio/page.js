'use client'

import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';

export default function AudioUpload({avatars}) {
    const router = useRouter();

    const [audioFile, setAudioFile] = useState(null);
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [uploading, setUploading] = useState(false)
    const [currentSession, setCurrentSession] = useState({});


    useEffect(() => {
        // Fetching assets from the server
        console.log("fetching...")
        const fetchCurrentAssets = async () => {
            try {
                const response = await fetch('http://localhost:5000/get-session');
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

    const handleAvatarChange = (event) => {
        setSelectedAvatar(event.target.value); // Set the selected avatar
    };

    const handleSubmit = async (event) => {
        setUploading(true)

        event.preventDefault();
        if (audioFile && selectedAvatar) {
            const formData = new FormData();
            formData.append('audio_file', audioFile);
            formData.append('avatar_name', selectedAvatar);

            try {
                const response = await fetch('http://localhost:5000/attach-audio', {
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
        router.push('/', 3);
    };


    if (currentSession['avatars'] && Object.keys(currentSession['avatars']).length) {

    console.log(currentSession['avatars'] )
        const avatars = currentSession['avatars']

        return (
            <div style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
                <h1>Upload Audio for Avatar</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Select Avatar:
                        <select className={'bg-gray-800'}
                            value={selectedAvatar} onChange={handleAvatarChange}
                                style={{display: 'block', margin: '10px 0'}}>
                            <option value="">Select an Avatar</option>
                            {Object.entries(currentSession['avatars']).map(([avatar, value], key) => (
                                <option key={avatar} value={avatar}>{avatar}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Select Audio File:
                        <input type="file" accept="audio/*" onChange={handleAudioFileChange}
                               style={{display: 'block', margin: '10px 0'}}/>
                    </label>
                    <button className={'bg-gray-800 px-3 py-1 rounded-lg mt-3'} type="submit">Attach Audio</button>

                    {uploading === true ? <div className="flex mt-3 min-h-screen"><div className="text-xl font-semibold text-gray-100">
                    Uploading...
                    <span className="animate-ping absolute h-3 w-3 rounded-full bg-blue-100 opacity-75"></span>
                </div>
            </div> : <h2></h2>}
                </form>

                <button className={'bg-gray-800 px-3 py-1 rounded-lg'} onClick={handleGoBack} style={{marginTop: '20px'}}>Back</button>
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
