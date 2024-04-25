"use client";

import { Environment, Html, OrbitControls, useVideoTexture } from "@react-three/drei";
import React, { Suspense, useEffect, useState } from "react";
import { useControls } from "leva";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three"
import { Avatar } from './AvatarRenderer';



export const AvatarRendererList = ({ avatars }) => {

    // leva ui controls
    const numberOfControls = Object.keys(avatars).length;

    const controls = Array.from({ length: numberOfControls }, (_, index) => ({
        label: `Avatar ${index}`,
        value: "t-pose (default)",
        options: ["t-pose (default)", "sit", "stand", "arms-crossed"]
    }));

    const dynamicControls = useControls(() => {
        const dynamicControlObject = {};
        controls.forEach((control, index) => {
            dynamicControlObject[`Avatar ${index}`] = {
                value: control.value,
                options: control.options
            };
        });
        return dynamicControlObject;
    });

    return (
        <>
            {Object.entries(avatars).map(([key, value], index) => (
                <Avatar
                    theatreKey={`person${key}`}
                    glbEndpoint={`http://localhost:5000/avatars/${key}`}
                    audioEndpoint={`http://localhost:5000/audio/${value['audio']}`}
                    audioJsonEndpoint={`http://localhost:5000/audio/${value['audio_json']}`}
                    position={[index, 0, 0]}
                    key={index}
                    pose={dynamicControls[0]['Avatar ' + index]}
                />
            ))}
        </>
    );
};

export default AvatarRendererList;