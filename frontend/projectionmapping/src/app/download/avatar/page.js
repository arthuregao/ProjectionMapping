'use client'

import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import ThumbnailDisplay from "../../components/ThumbnailDisplay";

export default function AudioUpload({avatars}) {
    const router = useRouter();

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

    const handleAvatarChange = (avatar) => {
        setSelectedAvatar(avatar); // Set the selected avatar
    };

    const handleSubmit = async (event) => {
        setUploading(true);
        event.preventDefault();

        if (selectedAvatar) {
            try {
                const downloadUrl = `http://localhost:5000/avatars/${selectedAvatar}`;

                // Create a temporary link to trigger the download
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', selectedAvatar); // Optionally force download
                document.body.appendChild(link);
                link.click();
                link.remove();

                console.log("Download initiated for:", selectedAvatar);
            } catch (error) {
                console.error('Error downloading the avatar:', error);
            }
        } else {
            console.log("No avatar chosen.");
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
                        <h1>Download Avatar</h1>
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
                        <p className={'mt-2'}>
                            Note: To convert GLBs to 3d printable STL files, please use:
                            <a className={'text-teal-300'}   target="_blank" href="https://imagetostl.com/convert/file/glb/to/stl"> This tool</a>
                        </p>

                        <button onClick={handleSubmit} className='add-btn px-3 py-1 mt-5'>Download</button>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                {/*<h1>You must upload avatars before you can download an STL</h1>*/}
                {/*<button onClick={handleGoBack} style={{marginTop: '20px'}}>Back</button>*/}
            </div>

        )
    }
}
