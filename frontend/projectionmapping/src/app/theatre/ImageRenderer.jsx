import React, { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { editable as e } from "@theatre/r3f";
import { types } from '@theatre/core'

export default function SheetImage(props) {

    const { imageEndpoint, index } = props
    const imageRef = useRef()

    useEffect(
        () => {
            if (!imageRef.current) return;

            console.log(imageRef);
        },
        [imageRef],
    )

    const Texture = ({ texture }) => {
        return (
            <e.mesh
                theatreKey={`image${index}`}
                additionalProps={{opacity: types.number(1, { range: [0, 1] })}}
                objRef={imageRef}
            >

                <planeGeometry attach="geometry" args={[5, 4]}/>
                <meshBasicMaterial attach="material" map={texture}/>
            </e.mesh>
        );
    };

    const Image = ({url}) => {
        const texture = useMemo(() => new THREE.TextureLoader().load(url), [url])
        return <Texture texture={texture} />
    }

    return(
        <Image url={imageEndpoint}/>
    )

}
