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
            <div className="add-audio flex justify-center items-start p-9">
                <button className={'px-3 py-1 rounded-lg'} onClick={handleGoBack} style={{marginTop: '20px'}}>Back
                </button>

                <div>
                    <h1>Upload Audio for Avatar</h1>
                    <h2>Select Avatar</h2>
                    <div className='upload-col grid mt-7 gap-4'>
                        {Object.entries(currentSession['avatars']).map(([avatar, value], index) => (
                            value?.thumbnail ? (
                                <div key={index}
                                     onClick={() => handleAvatarChange(avatar)}>
                                    <ThumbnailDisplay name={value.thumbnail}/>
                                </div>
                            ) : null
                        ))}
                    </div>
                    <h2>Select Audio</h2>
                    <input type="file" accept="audio/*" onChange={handleAudioFileChange} style={{display: 'none'}}/>
                    <button className="add-btn px-3 py-1 mt-3"
                            onClick={() => document.querySelector('input[type="file"]').click()}>
                        Select File
                    </button>
                    {audioFile && <span>{audioFile.name}</span>}

                    <button onClick={handleSubmit} className='add-btn px-3 py-1 mt-3'>Submit</button>


                    {/*<form onSubmit={handleSubmit}>*/}
                    {/*    <label>*/}
                    {/*        Select Avatar:*/}
                    {/*        <select*/}
                    {/*            value={selectedAvatar} onChange={handleAvatarChange}*/}
                    {/*            style={{display: 'block', margin: '10px 0'}}>*/}
                    {/*            <option value="">Select an Avatar</option>*/}
                    {/*            {Object.entries(currentSession['avatars']).map(([avatar, value], index) => (*/}
                    {/*                <option key={avatar} value={avatar}>*/}
                    {/*                    <React.Fragment key={index}>*/}
                    {/*                        /!*<AvatarDisplay name={key}></AvatarDisplay>*!/*/}
                    {/*                        {value.thumbnail ?*/}
                    {/*                            <ThumbnailDisplay name={value.thumbnail}></ThumbnailDisplay> : null}*/}
                    {/*                    </React.Fragment>*/}
                    {/*                </option>*/}
                    {/*            ))}*/}
                    {/*        </select>*/}
                    {/*    </label>*/}
                    {/*    <label>*/}
                    {/*        Select Audio File:*/}
                    {/*        <input type="file" accept="audio/*" onChange={handleAudioFileChange}*/}
                    {/*               style={{display: 'block', margin: '10px 0'}}/>*/}
                    {/*    </label>*/}
                    {/*    <button className={'add-btn px-3 py-1 mt-3'} type="submit">Attach Audio</button>*/}

                    {/*    {uploading === true ? <div className="flex mt-3 min-h-screen">*/}
                    {/*        <div className="text-xl font-semibold text-gray-100">*/}
                    {/*            Uploading...*/}
                    {/*            <span*/}
                    {/*                className="animate-ping absolute h-3 w-3 rounded-full bg-blue-100 opacity-75"></span>*/}
                    {/*        </div>*/}
                    {/*    </div> : <h2></h2>}*/}
                    {/*</form>*/}
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
