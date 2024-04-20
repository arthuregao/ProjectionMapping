"use client";

import {useRouter} from 'next/navigation'
import React, {useEffect, useState} from "react";

import "./style.css";
import AvatarDisplay from "./components/AvatarDisplay"
import ImageDisplay from "./components/ImageDisplay"

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
            // TODO: implement "add text" page
        } else {
            // TODO: implement "upload sound" page
        }
    }

    function renderTabContent() {
        switch (activeTab) {
            case 0:

                if (currentSession['avatars']) {
                    // console.log(Object.entries(currentSession['avatars']))
                    // console.log('attempting to display avatars')
                    return (
                        <div>Create or select avatars.
                            {Object.entries(currentSession['avatars']).map(([key, value], index) =>
                                <AvatarDisplay name={key} key={index}></AvatarDisplay>
                            )}
                        </div>
                    );
                } else {
                    return (
                        <div>Create or select avatars.</div>
                    )
                }
            case 1:

                if (currentSession['images']) {
                    console.log('attempting to display images')
                    return (
                        <div>
                            Upload images here.

                            {currentSession['images'].map((value, index) =>
                                <ImageDisplay name={value} key={index}></ImageDisplay>
                            )}
                        </div>
                    );
                } else {
                    return <div>Upload images here.</div>;
                }

            case 2:
                return <div>Add text content.</div>;
            case 3:
                return <div>Upload sounds.</div>;
            default:
                return <div>Select a category to add content.</div>;
        }
    }


    return (
        <main className="w-full min-h-screen p-24">
            <h1>Projection Mapping</h1>
            <h2 className="mb-10">Welcome, Samira!</h2>
            <div className="flex tab-group" style={{gap: "10px"}}>
                {tabList.map((name, i) =>
                    <button
                        key={i}
                        className={activeTab === i ? "active px-3 py-1" : "px-3 py-1 selection-tab-btn"}
                        onClick={() => setActiveTab(i)}
                    >
                        {name}
                    </button>
                )}
            </div>
            <hr className="horizontal-line"/>

            {/*render the correct component based on tab*/}
            {renderTabContent()}

            <button
                className="add-btn mt-10 font-light text-4xl"
                type="submit"
                onClick={() => {
                    handleAdd();
                }}
            >
                +
            </button>
        </main>
    );
}
