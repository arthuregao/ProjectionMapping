import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { editable as e } from "@theatre/r3f";
import { types } from '@theatre/core'

export default function SheetImage(props) {

    const { imageEndpoint, index } = props
    // A reference to the THREE.js object
    const imageRef = useRef()

    const [
        // The Theatre.js object that represents our THREE.js object. It'll be initially `null`.
        imageObject,
        setImageObject,
    ] =
        // Let's use `useState()` so our `useEffect()` will re-run when `theatreObject` changes
        useState(null)


    // // This `useEffect()` will run when `theatreObject` changes
    // useEffect(
    //     () => {
    //         // if `theatreObject` is `null`, we don't need to do anything
    //         if (!imageObject) return
    //
    //         const unsubscribe = imageObject.onValuesChange((newValues) => {
    //             // Apply the new offset to our THREE.js object
    //             imageRef.current.opacity = newValues.imageObject
    //             imageRef.style.opacity = opacity;
    //         })
    //         // unsubscribe from the listener when the component unmounts
    //         return unsubscribe
    //     },
    //     // We only want to run this `useEffect()` when `theatreObject` changes
    //     [imageObject],
    // )


    const Texture = ({ texture }) => {
        return (
            <e.mesh
                theatreKey={`image${index}`}
                // additionalProps={{opacity: types.number(1, { range: [0, 1] })}}
                // ref={imageRef}
                // objRef={setImageObject}
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