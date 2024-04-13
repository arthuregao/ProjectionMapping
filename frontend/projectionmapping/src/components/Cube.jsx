import { useRef } from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from 'three'
const Cube = (position, size, color) => {
    const ref = useRef<THREE.Mesh>

    useFrame((state, delta) => {
        ref.current.rotation.x += delta
    })

    return (
        <mesh position={position} ref={ref}>
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}

export default Cube