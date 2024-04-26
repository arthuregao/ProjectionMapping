'use client'

// React Core
import React, {useEffect, useState, useRef} from 'react';

// Third-party libraries for 3D and graphics
import {Canvas} from '@react-three/fiber';
import {OrbitControls, Stars, Environment} from "@react-three/drei";
import {editable as e, SheetProvider} from "@theatre/r3f";
import {getProject} from "@theatre/core";
import {useVal} from "@theatre/react"
import studio, {IExtension} from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";


// Local components
import {Avatar} from './AvatarRendererAudio';
import SheetImage from "./ImageRenderer";
import {AudiolessAvatar} from "./AvatarRendererNoAudio";
import  OrbitControlsWithLogging  from './OrbitControlsWithLogging';

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

    useEffect(() => {
        const handleKeyDown = (event) => {
            // toggle with space bar
            if (event.code === "Space") {
                demoSheet.sequence.play({iterationCount: 1}).then(
                    () => console.log("playing..."))
                console.log( camera.position );
            }
        };
        window.addEventListener("keydown", handleKeyDown);

    }, [])

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


        Object.entries(currentSession['avatars']).map(([key, value], index) => console.log(key, value));
        return (
            <Canvas>
                <SheetProvider sheet={demoSheet}>
                    <OrbitControlsWithLogging />

                    {Object.entries(currentSession['avatars']).map(([key, value], index) =>
                        value['audio'] ?
                            <Avatar
                                theatreKey={`person${key}`}
                                glbEndpoint={`http://localhost:5000/avatars/${key}`}
                                audioEndpoint={`http://localhost:5000/audio/${value['audio']}`}
                                audioJsonEndpoint={`http://localhost:5000/audio/${value['audio_json']}`}
                                position={[index, 0, 0]}
                                key={index}
                            /> :
                            <AudiolessAvatar
                                theatreKey={`person${key}`}
                                glbEndpoint={`http://localhost:5000/avatars/${key}`}
                                position={[index, 0, 0]}
                                key={index}
                            />
                    )}

                    {currentSession['images'].map((value, index) =>
                        <SheetImage
                            key={index}
                            imageEndpoint={`http://localhost:5000/images/${value}`}
                            index={index}
                        />
                    )}

                    <Environment preset="sunset"/>
                </SheetProvider>
            </Canvas>
        );
    } else {
        return (
            <div className="flex flex-col justify-start items-center min-h-screen">
                <div className="text-xl font-semibold text-gray-100">
                    Loading...
                    <span className="animate-ping absolute h-3 w-3 rounded-full bg-blue-100 opacity-75"></span>
                </div>
            </div>

        )
    }
}

