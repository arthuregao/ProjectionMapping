"use client";
// <<<<<<< HEAD
import Link from "next/link";
import React from "react";
//
// export default function Home() {
//
//     return (
//         <div style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             height: '100vh',
//             flexDirection: 'column'
//         }}>
//             <h1>Welcome to the Homepage</h1>
//             <p>Click below to go to the Avatar Creator page:</p>
//             <Link href="/create-avatar">
//                 Create Avatar
//             </Link>
//             <Link href="/about">
//                 about
//             </Link>
//         </div>
//
//     );
// =======

import "./style.css";
import {useState} from "react";

export default function Home() {
    const [activeTab, setActiveTab] = useState(0);
    const [avatar, setAvatar] = useState("");
    const tabList = ["Avatars", "Images", "Text", "Audio"]


    function handleAdd() {
        if (activeTab === 0) {

        } else if (activeTab === 1) {

        } else if (activeTab === 2) {

        } else {

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
                    className={activeTab === i ? "active px-3 py-1 font-style" : "px-3 py-1 font-style"}
                    onClick={() => setActiveTab(i)}
                >
                    {name}
                </button>
            )}
        </div>
        <hr className="horizontal-line"/>
        <button
            className="add-btn mt-10"
            type="submit"
            onClick={() => {
                handleAdd();
            }}
        ></button>
    </main>
  );
}
