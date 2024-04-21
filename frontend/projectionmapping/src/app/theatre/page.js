'use client'

import React from 'react'
// import {Model} from './test'
import {Avatar} from './temp'
import {Canvas} from '@react-three/fiber'
import {editable as e, SheetProvider} from "@theatre/r3f";
import { OrbitControls, Stars, Environment } from "@react-three/drei";
import {getProject} from "@theatre/core";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";

// const demoSheet = getProject("Demo Project").sheet("Demo Sheet");

function TestTheatre(props) {
    // return(
    //     <div>
    //         <h1>{props.name}</h1>
    //         <Canvas>
    //             <Model position={[0, 0, 0]}></Model>
    //         </Canvas>
    //     </div>
    // )

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    return (
        // <div style={{height: '2000px', width: '2000px'}}>
        <Canvas camera={{ position: [5, 2, 10], fov: 30 }} style={{ width: "100vw", height: "100vh" }}>
            {/*<color attach="background" args={["#fff"]} />*/}
            {/*<Model position={[0, -3, 5]} scale={2}/>*/}
            {/*<perspectiveCamera*/}
            {/*    fov={75}*/}
            {/*    aspect={sizes.width / sizes.height}*/}
            {/*    position={[0, 0, 3]}*/}
            {/*    near={0.1}*/}
            {/*    far={100}*/}
            {/*>*/}

            <OrbitControls />
            {/*<Avatar position={[0, -3, 5]} scale={2}/>*/}
            <Avatar/>

            {/*<Model position={[0, -3, 5]} scale={0.5}/>*/}
            {/*<Model />*/}


            <Environment preset="sunset"/>
            {/*</perspectiveCamera>*/}
        </Canvas>
        // </div>
    );
}

export default TestTheatre