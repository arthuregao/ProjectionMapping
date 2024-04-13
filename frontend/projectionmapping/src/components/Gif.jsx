import React, {useRef, useState} from 'react';
import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import { Html } from '@react-three/drei';
import {PlainAnimator} from "three-plain-animator/lib/plain-animator";
import * as THREE from "three"


const Gif = ({ textureSrc, IconPosition, IconSize }) => {
    const spriteTexture = useLoader(THREE.TextureLoader, textureSrc)
    const [animator] = useState(() => new PlainAnimator(spriteTexture, 4, 4, 10, 10))
    useFrame(() => animator.animate())
    return (
        <spotLight position={[0, 10, 0]} intensity={1} color="#fff" map={spriteTexture} />
    )
}

export default Gif;
