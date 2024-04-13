"use client";


import Image from "next/image";
import {Canvas} from "@react-three/fiber";
import {Experience} from "@/components/Experience";



export default function Home() {
    return (
    <main>
        <Canvas shadows camera={{position: [0, 0, 8], fov: 42}} style={{ width: "100vw", height: "100vh" }}>
            <color attach="background" args={["#ececec"]}/>
            <Experience/>
        </Canvas>
    </main>
  );
}
