"use client";

import {useRouter} from 'next/navigation'
import React, {useEffect, useState} from "react";

import AvatarDisplay from "./components/AvatarDisplay";
import ThumbnailDisplay from "./components/ThumbnailDisplay";
import ImageDisplay from "./components/ImageDisplay";
import AudioDisplay from "./components/AudioDisplay";
import TextDisplay from "./components/TextDisplay";


export default function Home() {

    const router = useRouter()

    const [activeTab, setActiveTab] = useState(0);
    const [currentSession, setCurrentSession] = useState({});
    const tabList = ["Avatars", "Images", "Audio", "Download GLB"]

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

    function handleAdd() {
        if (activeTab === 0) {
            router.push('/upload/create-avatar')
        } else if (activeTab === 1) {
            router.push('/upload/image')
        } else if (activeTab === 2) {
            router.push('/upload/audio')
        } else {
            router.push('/upload/convert')
        }
    }

    function renderTabContent() {
        switch (activeTab) {
            case 0:

                if (currentSession['avatars']) {
                    // console.log(Object.entries(currentSession['avatars']))
                    // console.log('attempting to display avatars')
                    return (
                        <div>
                            <div className='sub-text'>Create or select avatars.</div>
                            <div className='upload-col grid mt-7 gap-4'>
                                {Object.entries(currentSession['avatars']).map(([key, value], index) => (
                                    <React.Fragment key={index}>
                                        {/*<AvatarDisplay name={key}></AvatarDisplay>*/}
                                        {value.thumbnail ?
                                            <ThumbnailDisplay name={value.thumbnail}></ThumbnailDisplay> : null}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className='sub-text'>Create or select avatars.</div>
                    )
                }
            case 1:

                if (currentSession['images']) {
                    console.log('attempting to display images')
                    return (
                        <div>
                            <div className='sub-text'>
                                Upload images here.
                            </div>
                            <div className='upload-col grid mt-7 gap-4'>
                                {currentSession['images'].map((value, index) =>
                                    <ImageDisplay name={value} key={index}></ImageDisplay>
                                )}
                            </div>
                        </div>
                    );
                } else {
                    return <div className='sub-text'>Upload images here.</div>;
                }

            case 2:

                if (currentSession['audio']) {
                    console.log('attempting to display audio')
                    return (
                        <div>
                            <div className='sub-text'>
                                Upload Audio here.
                            </div>
                            <div className='upload-col grid mt-7 gap-4'>
                                {currentSession['audio'].map((value, index) =>
                                    <AudioDisplay name={value} key={index}></AudioDisplay>
                                )}
                            </div>
                        </div>
                    );
                } else {
                    return <div className='sub-text'>Upload Audio here.</div>;
                }

            case 3:

                // console.log('attempting to download glb')
                //     return (
                //         <div>
                //             <div className='sub-text'>
                //                 Convert avatar to 3D Model!
                //             </div>
                //         </div>
                //     )

                router.push('/download/avatar')

            default:
                return <div className='sub-text'>Select a category to add content.</div>;
        }
    }

    const switchTheme = event => {
        const icon = document.getElementById("theme-icon");
        document.body.classList.toggle("light-theme");
        if (document.body.classList.contains("light-theme")) {
            icon.src = '/assets/sun.png';
        } else {
            icon.src = '/assets/moon.png';
        }
    }


    return (
        <main className="min-h-screen p-24">
            <div className='theme-switch'>
                <h2>Welcome!</h2>
                <img alt='moon'
                     src='/assets/moon.png'
                     id='theme-icon'
                     onClick={switchTheme}
                />

            </div>
            <h1 className="mb-10 title">Projection Mapping</h1>
            <div className="flex justify-between tab-group">
                <div className="flex space-x-4">
                    {tabList.map((name, i) =>
                        i !== 4 ?
                            <button
                                key={i}
                                className={activeTab === i ? "active px-7 py-2" : "px-7 py-2 selection-tab-btn"}
                                onClick={() => setActiveTab(i)}
                            >
                                {name}
                            </button>
                            :
                            <div className={'w-0'} key={i}></div>
                    )}
                </div>

                <button
                    key={4}
                    className={activeTab === 4 ? "active px-7 py-2" : "px-7 py-2 add-btn"}
                    onClick={() => router.push('/theatre')}
                >
                    Animate!
                </button>
            </div>

            {/*render the correct component based on tab*/}
            {renderTabContent()}

            <button
                className="add-btn mt-7 px-4 py-2"
                type="submit"
                onClick={() => {
                    handleAdd();
                }}
            >
                + Add new
            </button>

        </main>
    );
}
