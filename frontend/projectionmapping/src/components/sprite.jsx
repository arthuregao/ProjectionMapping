import * as THREE from "three"
import React, {Suspense, useState} from "react"
import {Canvas, useLoader, useFrame} from "@react-three/fiber"
import {PlainAnimator} from "three-plain-animator/lib/plain-animator"
import { useControls } from "leva";

/*
params
IconPosition: [x, y, z] positioning relative to 2d background
IconSize: [width, height, depth] N.B. when depth is not 0, sprite plays only on the 3 faces camera is currently
facing towards of the cube. Does not play all 6 sides at once.
textureSrc: string to sprite sheet
SpriteDimensions: [tiles horizontally, tiles vertically, total tiles] (on sprite sheet)
 */
const Sprite = ({IconPosition, IconSize, textureSrc, SpriteDimensions}) => {

    const spriteTexture = useLoader(THREE.TextureLoader, textureSrc);

    const [animator] = useState(() =>
        new PlainAnimator(spriteTexture,
            SpriteDimensions[0], SpriteDimensions[1], SpriteDimensions[2],
            10))

    useFrame(() => animator.animate())

    return (
        <mesh position={IconPosition}>
            <boxGeometry args={IconSize}/>
            <meshStandardMaterial map={spriteTexture} transparent={true}/>
        </mesh>
    )
};

export default Sprite;