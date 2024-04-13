import React, { useEffect, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import { useControls } from "leva";

const Background = () => {
    // State to hold the current background option
    const [selectedBackground, setSelectedBackground] = useState(() => {
        // Retrieve the selected background option from localStorage
        return localStorage.getItem("selectedBackground") || "firstBackground";
    });

    // leva UI controls
    const { background } = useControls({
        background: {
            value: selectedBackground,
            options: ["firstBackground", "secondBackground", "beach"],
        },
    });

    // useEffect to update localStorage when the background option changes
    useEffect(() => {
        localStorage.setItem("selectedBackground", background);
        setSelectedBackground(background);
    }, [background]);

    // Load different textures based on the selected background
    const texture = useTexture(`textures/${selectedBackground}.jpg`);

    /* viewport object */
    const viewport = useThree((state) => state.viewport);

    return (
        <mesh>
            {/* plane acting as background on which the image is placed */}
            <planeGeometry args={[viewport.width, viewport.height]} />
            {/* place image on plane */}
            <meshBasicMaterial map={texture} />
        </mesh>
    );
};

export default Background;
