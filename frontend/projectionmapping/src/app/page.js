"use client";

import {useRouter} from 'next/navigation'
import React, {useEffect, useState} from "react";

import "./style.css";
import AvatarDisplay from "./components/AvatarDisplay";
import ImageDisplay from "./components/ImageDisplay";
import AudioDisplay from "./components/AudioDisplay";
import TextDisplay from "./components/TextDisplay";

import {moonIcon} from "./images/moon.png";
import {sunIcon} from "./images/sun.png";

export default function Home() {

    const router = useRouter()

    const [activeTab, setActiveTab] = useState(0);
    const [currentSession, setCurrentSession] = useState({});
    const tabList = ["Avatars", "Images", "Text", "Audio"]

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

    function handleAdd() {
        if (activeTab === 0) {
            router.push('/upload/create-avatar')
        } else if (activeTab === 1) {
            router.push('/upload/image')
        } else if (activeTab === 2) {
            router.push('/upload/text')
        } else {
            router.push('/upload/audio')
        }
    }

    function renderTabContent() {
        switch (activeTab) {
            case 0:

                if (currentSession['avatars']) {
                    // console.log(Object.entries(currentSession['avatars']))
                    // console.log('attempting to display avatars')
                    return (
                        <div className='sub-text'>Create or select avatars.
                            {Object.entries(currentSession['avatars']).map(([key, value], index) =>
                                <AvatarDisplay name={key} key={index}></AvatarDisplay>
                            )}
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
                        <div className='sub-text'>
                            Upload images here.

                            {currentSession['images'].map((value, index) =>
                                <ImageDisplay name={value} key={index}></ImageDisplay>
                            )}
                        </div>
                    );
                } else {
                    return <div className='sub-text'>Upload images here.</div>;
                }

            case 2:

                if (currentSession['text']) {
                    console.log('attempting to display text')
                    return (
                        <div className='sub-text'>
                            Add text content.

                            {currentSession['text'].map((value, index) =>
                                <TextDisplay name={value} key={index}/>
                            )}
                        </div>
                    )
                } else {

                return <div className='sub-text'>Add text content.</div>;
                }
            case 3:

                if (currentSession['audio']) {
                    console.log('attempting to display audio')
                    return (
                        <div className='sub-text'>
                            Upload Audio here.

                            {currentSession['audio'].map((value, index) =>
                                <AudioDisplay name={value} key={index}></AudioDisplay>
                            )}
                        </div>
                    );
                } else {
                    return <div className='sub-text'>Upload Audio here.</div>;
                }

            default:
                return <div className='sub-text'>Select a category to add content.</div>;
        }
    }

    function goToTheatre() {

    }

    const switchTheme = event => {
        const icon = document.getElementById("theme-icon");
        document.body.classList.toggle("light-theme");
        if (document.body.classList.contains("light-theme")) {
            icon.src = sunIcon;
        } else {
            icon.src = moonIcon;
        }
    }


    return (
        <main className="min-h-screen p-24">
            <div className='theme-switch'>
                <h2>Welcome!</h2>
                <img src={moonIcon}
                    id='theme-icon'
                    onClick={switchTheme}
                />
            </div>
            <h1 className="mb-10 title">Projection Mapping</h1>
            <div className="flex tab-group">
                {tabList.map((name, i) =>
                    <button
                        key={i}
                        className={activeTab === i ? "active px-7 py-2" : "px-7 py-2 selection-tab-btn"}
                        onClick={() => setActiveTab(i)}
                    >
                        {name}
                    </button>
                )}

                <button
                    key={4}
                    className={activeTab === 4 ? "active px-7 py-2" : "px-7 py-2 selection-tab-btn"}
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
