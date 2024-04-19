"use client";

import {useRouter} from 'next/navigation'
import React from "react";
import "./style.css";
import {useState} from "react";

export default function Home() {

    const router = useRouter()

    const [activeTab, setActiveTab] = useState(0);
    const [avatar, setAvatar] = useState("");
    const tabList = ["Avatars", "Images", "Text", "Audio"]


    function handleAdd() {
        if (activeTab === 0) {
            router.push('/create-avatar')
        } else if (activeTab === 1) {
            // TODO: implement "upload image" page
        } else if (activeTab === 2) {
            // TODO: implement "add text" page
        } else {
            // TODO: implement "upload sound" page
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
