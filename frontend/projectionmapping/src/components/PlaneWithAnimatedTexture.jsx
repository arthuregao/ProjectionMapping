import React, { useRef } from 'react';
import { Canvas, useFrame } from 'react-three/fiber';
import {Mesh, TextureLoader} from 'three';

const PlaneWithAnimatedTexture = () => {
    const planeRef = useRef<Mesh>null;

    useFrame(() => {
        planeRef.current.rotation.x += 0.01;
        planeRef.current.rotation.y += 0.01;
    });

    return (
        <mesh ref={planeRef}>
            <planeGeometry args={[5, 5]} />
            <meshBasicMaterial attach="material">
                <texture attach="map" url="textures/homer.gif" />
            </meshBasicMaterial>
        </mesh>
    );
};

export default PlaneWithAnimatedTexture;