import * as THREE from "three"
import React, { Suspense, useState } from "react"
import { Canvas, useLoader, useFrame } from "@react-three/fiber"
import { PlainAnimator } from "three-plain-animator/lib/plain-animator"

function Sprite2({ textureSrc, IconPosition, IconSize }) {
    const spriteTexture = useLoader(THREE.TextureLoader, textureSrc)
    const [animator] = useState(() => new PlainAnimator(spriteTexture, 4, 4, 10, 10))
    useFrame(() => animator.animate())
    return (
        <mesh position={IconPosition}>
            <boxGeometry args={IconSize} />
            <meshStandardMaterial map={spriteTexture} transparent={true} />
        </mesh>
    )
}

export default Sprite2