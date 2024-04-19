"use client";

import {Environment, Html, OrbitControls, useVideoTexture} from "@react-three/drei";
import {Avatar} from "./Avatar";
import Background from "./Background.jsx";
import React, {Suspense, useEffect, useState} from "react";
import Sprite from "./sprite.jsx";
import {useControls} from "leva";
import {useLoader} from "@react-three/fiber";
import * as THREE from "three"


export const Experience = () => {

    // get initial values or defaults from local storage
    const {homerheight: initialHeight} = JSON.parse(localStorage.getItem('levaState')) || {homerheight: 1};

    // leva UI controls
    const {
        homerHeight,
        avatarPose,

    } = useControls({
        homerHeight: initialHeight,
        avatarPose: {
            value: "t-pose (default)",
            options: ["t-pose (default)", "sit"]
        }
    });

    // // update local storage whenever Leva control changes
    // useEffect(() => {
    //     localStorage.setItem('levaState', JSON.stringify({homerheight}));
    // }, [homerheight]);

    // texture for static beach ball image
    const balltexture = useLoader(THREE.TextureLoader, "textures/beachball.png")

    const campfiretexture = useLoader(THREE.TextureLoader, "textures/campfire.gif")

    const videoTexture = useVideoTexture("textures/earth.mp4");

    return (
        <>
            <OrbitControls enabled={true}/>

            {/* position param: [x, y, z] */}
            {/* to apply rotation add arg: rotation={[0, Math.PI / 2, 0]} */}
            <Avatar
                position={[0, -2, 1]}
                scale={2}
                modelGLTF="models/646d9dcdc8a5f5bddbfac913.glb"
                pose={avatarPose}
            />

            {/*<Avatar position={[-2, -2, 1]} scale={2} modelGLTF="models/harriet.glb"/>*/}


            <Environment preset="sunset"/>

            <Background />

            <mesh position={[-3, -2, 0.1]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial attach="material" map={balltexture} transparent={true} />
            </mesh>

            <Suspense fallback={null}>

                <Sprite IconPosition={[-2, 0, 0.1]} IconSize={[3, homerHeight, 0]}
                        textureSrc="textures/homersprite.png"
                        SpriteDimensions={[4, 4, 10]}/>

                {/*<Sprite IconPosition={[0, -1, 0.1]} IconSize={[2, 2, 0]} textureSrc="textures/campfiresprite.jpg"*/}
                {/*        SpriteDimensions={[6, 1, 6]}/>*/}

            </Suspense>

        </>
    );
};
