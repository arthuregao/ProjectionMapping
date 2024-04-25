'use client'

// React Core
import React, { useEffect, useState } from 'react';

// Third-party libraries for 3D and graphics
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from "@react-three/drei";
import { editable as e, SheetProvider } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import { useVal } from "@theatre/react"
import studio, { IExtension } from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";

// Local components
import { AvatarRendererList } from './Avatars';
import SheetImage from "./ImageRenderer";

const demoSheet = getProject("Demo Project").sheet("Demo Sheet");

const addAssetsConfig = {
    id: 'add-assets-extension',
    toolbars: {
        global(set, studio) {
            const toolsetConfig = [{
                type: 'Icon',
                title: 'Add Assets',
                svgSource: '+',
                onClick: () => window.location.href = '/'
            }]
            set(toolsetConfig)
        },
    },
    panes: [],
}

studio.initialize()
studio.extend(extension)
studio.extend(addAssetsConfig)

export default function Theatre(props) {

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
    }, [])

    if (currentSession['avatars']) {
        console.log("Current Avatars: ");
        console.log(Object.entries(currentSession['avatars']));
        Object.entries(currentSession['avatars']).map(([key, value], index) => console.log(key, value));
        return (
            <Canvas camera={{ position: [5, 2, 10], fov: 30 }} style={{ height: "100vh", margin: "0" }}>
                <SheetProvider sheet={demoSheet}>
                    <OrbitControls />

                    <AvatarRendererList avatars={currentSession['avatars']} />

                    {currentSession['images'].map((value, index) =>
                        <SheetImage
                            imageEndpoint={`http://localhost:5000/images/${value}`}
                            index={index}
                        />
                    )}

                    <Environment preset="sunset" />
                </SheetProvider>
            </Canvas>
        );
    } else {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl font-semibold text-gray-100">
                    Loading...
                    <span className="animate-ping absolute h-3 w-3 rounded-full bg-blue-100 opacity-75"></span>
                </div>
            </div>

        )
    }
}

