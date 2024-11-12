/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/models/65f86d86553ebe525eb5e280.glb -o src/components/Avatar.jsx -r public
*/

import {useAnimations, useFBX, useGLTF} from "@react-three/drei";
import {useFrame, useLoader} from "@react-three/fiber";
import {useControls} from "leva";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {editable as e, SheetProvider} from "@theatre/r3f";
import {getProject} from '@theatre/core'

import * as THREE from "three";

const corresponding = {
    A: "viseme_PP",
    B: "viseme_kk",
    C: "viseme_I",
    D: "viseme_AA",
    E: "viseme_O",
    F: "viseme_U",
    G: "viseme_FF",
    H: "viseme_TH",
    X: "viseme_PP",
};

export function Avatar(props) {

    const {glbEndpoint, audioEndpoint, audioJsonEndpoint} = props

    const {nodes, materials} = useGLTF(glbEndpoint)

    const audio = useMemo(() => new Audio(audioEndpoint), []);
    const jsonFile = useLoader(THREE.FileLoader, audioJsonEndpoint);
    const lipsync = JSON.parse(jsonFile);

    const {
        // playAudio,
        smoothMorphTarget,
        morphTargetSmoothing,
    } = useControls({
        // playAudio: false,
        smoothMorphTarget: true,
        morphTargetSmoothing: 0.5
    });

    // replace playAudio control from Leva UI with spacebar toggle
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            // toggle with space bar
            if (event.code === "Space") {
                setIsPlaying((prevIsPlaying) => !prevIsPlaying);
            }
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        // morph targets for rhubarb
        nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary["viseme_I"]
            ] = 1;
        nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary["viseme_I"]
            ] = 1;
        // state toggled by previous event listener
        if (isPlaying) {
            audio.play();
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    // when tracks have completed, add handleAudioEnded handler so 
    // the next space bar press starts another iteration of the audio
    useEffect(() => {
        // when audio ends, reset state so additional spacebar press
        // isn't needed
        const handleAudioEnded = () => {
            setIsPlaying(false);
        };
        audio.addEventListener("ended", handleAudioEnded);
        return () => {
            audio.removeEventListener("ended", handleAudioEnded);
        };
    }, []);

    useFrame(() => {
        const currentAudioTime = audio.currentTime;

        Object.values(corresponding).forEach((value) => {
            if (!smoothMorphTarget) {
                nodes.Wolf3D_Head.morphTargetInfluences[
                    nodes.Wolf3D_Head.morphTargetDictionary[value]
                    ] = 0;
                nodes.Wolf3D_Teeth.morphTargetInfluences[
                    nodes.Wolf3D_Teeth.morphTargetDictionary[value]
                    ] = 0
            } else {
                nodes.Wolf3D_Head.morphTargetInfluences[
                    nodes.Wolf3D_Head.morphTargetDictionary[value]
                    ] = THREE.MathUtils.lerp(
                    nodes.Wolf3D_Head.morphTargetInfluences[
                        nodes.Wolf3D_Head.morphTargetDictionary[value]
                        ],
                    0,
                    morphTargetSmoothing
                );

                nodes.Wolf3D_Teeth.morphTargetInfluences[
                    nodes.Wolf3D_Teeth.morphTargetDictionary[value]
                    ] = THREE.MathUtils.lerp(
                    nodes.Wolf3D_Teeth.morphTargetInfluences[
                        nodes.Wolf3D_Teeth.morphTargetDictionary[value]
                        ],
                    0,
                    morphTargetSmoothing
                );
            }
        });

        for (let i = 0; i < lipsync.mouthCues.length; i++) {
            const mouthCue = lipsync.mouthCues[i];
            if (
                currentAudioTime >= mouthCue.start &&
                currentAudioTime <= mouthCue.end
            ) {
                if (!smoothMorphTarget) {
                    nodes.Wolf3D_Head.morphTargetInfluences[
                        nodes.Wolf3D_Head.morphTargetDictionary[
                            corresponding[mouthCue.value]
                            ]
                        ] = 1;
                    nodes.Wolf3D_Teeth.morphTargetInfluences[
                        nodes.Wolf3D_Teeth.morphTargetDictionary[
                            corresponding[mouthCue.value]
                            ]
                        ] = 1;
                } else {
                    nodes.Wolf3D_Head.morphTargetInfluences[
                        nodes.Wolf3D_Head.morphTargetDictionary[
                            corresponding[mouthCue.value]
                            ]
                        ] = THREE.MathUtils.lerp(
                        nodes.Wolf3D_Head.morphTargetInfluences[
                            nodes.Wolf3D_Head.morphTargetDictionary[
                                corresponding[mouthCue.value]
                                ]
                            ],
                        1,
                        morphTargetSmoothing
                    );
                    nodes.Wolf3D_Teeth.morphTargetInfluences[
                        nodes.Wolf3D_Teeth.morphTargetDictionary[
                            corresponding[mouthCue.value]
                            ]
                        ] = THREE.MathUtils.lerp(
                        nodes.Wolf3D_Teeth.morphTargetInfluences[
                            nodes.Wolf3D_Teeth.morphTargetDictionary[
                                corresponding[mouthCue.value]
                                ]
                            ],
                        1,
                        morphTargetSmoothing
                    );
                }

                break;
            }
        }
    });

    return (
        <e.group theatreKey="avatar" {...props} dispose={null}>
            <primitive object={nodes.Hips}/>

            {nodes.Wolf3D_Body && (
                <skinnedMesh
                    geometry={nodes.Wolf3D_Body.geometry}
                    material={materials.Wolf3D_Body}
                    skeleton={nodes.Wolf3D_Body.skeleton}
                />
            )}

            {nodes.Wolf3D_Outfit_Bottom && (
                <skinnedMesh
                    geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
                    material={materials.Wolf3D_Outfit_Bottom}
                    skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
                />
            )}

            {nodes.Wolf3D_Outfit_Footwear && (
                <skinnedMesh
                    geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
                    material={materials.Wolf3D_Outfit_Footwear}
                    skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
                />
            )}

            {nodes.Wolf3D_Outfit_Top && (
                <skinnedMesh
                    geometry={nodes.Wolf3D_Outfit_Top.geometry}
                    material={materials.Wolf3D_Outfit_Top}
                    skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
                />
            )}

            {nodes.Wolf3D_Hair && (
                <skinnedMesh
                    geometry={nodes.Wolf3D_Hair.geometry}
                    material={materials.Wolf3D_Hair}
                    skeleton={nodes.Wolf3D_Hair.skeleton}
                />
            )}

            {nodes.EyeLeft && (
                <skinnedMesh
                    name="EyeLeft"
                    geometry={nodes.EyeLeft.geometry}
                    material={materials.Wolf3D_Eye}
                    skeleton={nodes.EyeLeft.skeleton}
                    morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
                    morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
                />
            )}

            {nodes.EyeRight && (
                <skinnedMesh
                    name="EyeRight"
                    geometry={nodes.EyeRight.geometry}
                    material={materials.Wolf3D_Eye}
                    skeleton={nodes.EyeRight.skeleton}
                    morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
                    morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
                />
            )}

            {nodes.Wolf3D_Head && (
                <skinnedMesh
                    name="Wolf3D_Head"
                    geometry={nodes.Wolf3D_Head.geometry}
                    material={materials.Wolf3D_Skin}
                    skeleton={nodes.Wolf3D_Head.skeleton}
                    morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
                    morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
                />
            )}

            {nodes.Wolf3D_Teeth && (
                <skinnedMesh
                    name="Wolf3D_Teeth"
                    geometry={nodes.Wolf3D_Teeth.geometry}
                    material={materials.Wolf3D_Teeth}
                    skeleton={nodes.Wolf3D_Teeth.skeleton}
                    morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
                    morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
                />
            )}
        </e.group>
    );
}

useGLTF.preload("http://localhost:5050/avatars/65f86d86553ebe525eb5e280.glb");
