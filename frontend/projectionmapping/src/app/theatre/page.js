'use client'

// React Core
import React from 'react';

// Third-party libraries for 3D and graphics
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from "@react-three/drei";
import { editable as e, SheetProvider } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";

// Local components
import { Avatar } from './AvatarRenderer';


const demoSheet = getProject("Demo Project").sheet("Demo Sheet");
studio.initialize()
studio.extend(extension)

export default function Theatre(props) {

    return (
        <Canvas camera={{ position: [5, 2, 10], fov: 30 }} style={{ height: "100vh", margin: "0"}}>
            <SheetProvider sheet={demoSheet}>
                <OrbitControls />
                <Avatar
                    glbEndpoint='http://localhost:5000/avatars/65f86d86553ebe525eb5e280.glb'
                    audioEndpoint='http://localhost:5000/audio/audio-240420-23-37-11-person1.ogg'
                    audioJsonEndpoint='http://localhost:5000/audio/audio-240420-23-37-11-person1.json'
                    position={[1, 0, 0]}
                />

                <Avatar
                    glbEndpoint={'http://localhost:5000/avatars/avatar-240420-18-10-07.glb'}
                    audioEndpoint='http://localhost:5000/audio/audio-240420-23-37-36-person2.ogg'
                    audioJsonEndpoint='http://localhost:5000/audio/audio-240420-23-37-36-person2.json'
                />

                <Environment preset="sunset"/>
            </SheetProvider>
        </Canvas>
    );
}

