
const INTERPOLATIONS = {
    "LINEAR": 0,
    "SIN": 1,
}

const defaultOffset = {x: 0, y: 0, z: 0}
const defaultRotation = {x: 0, y: 0, z: 0}

const metal = {
    reflectivity: 0.5,
    metalness: 1.0,
    flatShading: false,
};

export {
    INTERPOLATIONS,
    defaultRotation,
    defaultOffset
}

export default [
    {
        src: 'Payload_Fairing_rev1',
        origin: {
            x: 0,
            y: 100,
            z: 0,
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        easing: INTERPOLATIONS.LINEAR,
        materialProperties: metal,
        keyframes: [
            {
                time: 0,
                offset: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            },
            {
                time: 1,
                offset: {
                    x: 0,
                    y: 25,
                    z: 0,
                },
                rotation: {
                    x: 0,
                    y: 0,
                    z: Math.PI / 2,
                }
            },
            {
                time: 2,
                offset: {
                    x: 0,
                    y: 50,
                    z: 0,
                },
                rotation: {
                    x: 0,
                    y: 0,
                    z: Math.PI
                }
            },
        ],
    },
    {
        src: 'Stage_1_Tank_rev1',
        origin: {
            x: 0,
            y: 0,
            z: 0,
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0,
        },
        materialProperties: metal,
        keyframes: [
            {
                time: 0,
                offset: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            },
            {
                time: 1,
                offset: {
                    x: -30,
                    y: 0,
                    z: 0
                }
            },
            {
                time: 5,
                offset: {
                    x: -30,
                    y: 30,
                    z: 100
                }
            },
        ]
    },
    //     {
    //     src: 'Payload_Platform_Black',
    //     origin: {
    //         x: 0,
    //         y: -100,
    //         z: 0,
    //     },
    //     rotation: {
    //         x: 0,
    //         y: 0,
    //         z: 0
    //     }
    // },
    // {
    //     src: 'Stage_1_Cover',
    //     origin: {
    //         x: 0,
    //         y: 0,
    //         z: 0,
    //     }
    // },
    // {
    //     src: 'Stage_1_Engines_rev1',
    //     origin: {
    //         x: 0,
    //         y: 0,
    //         z: 0,
    //     }
    // },
    // {
    //     src: 'Stage_1_Engines_Grey',
    //     origin: {
    //         x: 0, 
    //         y: 0,
    //         z: 0
    //     }
    // },
    // {
    //     src: 'Stage_1_Top_Ring_Grey',
    //     origin: {
    //         x: 0,
    //         y: 76,
    //         z: 0,
    //     },
    //     separation: 1.0
    // },
    // {
    //     src: 'Stage_2_Cover',
    //     origin: {
    //         x: 0,
    //         y: 0,
    //         z: 0,
    //     }
    // },
    // {
    //     src: 'Stage_2_Engine_Nozzle_Black',
    //     origin: {
    //         x: 0,
    //         y: 0,
    //         z: 0,
    //     }
    // },
    // {
    //     src: 'Stage_2_Tank_rev1',
    //     origin: {
    //         x: 0,
    //         y: 0,
    //         z: 0,
    //     }
    // },
    // {
    //     src: 'Stage_2_Small_Batteries_Grey',
    //     origin: {
    //         x: 0,
    //         y: 0,
    //         z: 0,
    //     }
    // },
    // {
    //     src: 'Stage_2_Small_Cylindrical_Tank_Grey',
    //     origin: {
    //         x: 0,
    //         y: 0,
    //         z: 0,
    //     }
    // },
    // {
    //     src: 'Stage_2_Tank_rev1',
    //     origin: {
    //         x: 0,
    //         y: 0,
    //         z: 0,
    //     }
    // },
    // {
    //     src: 'Stage_2_Top_Ring_Grey',
    //     origin: {
    //         x: 0,
    //         y: 0,
    //         z: 0,
    //     }
    // },
    // {
    //     src: 'Stage_2_Engine_Nozzle_Grey',
    //     origin: {
    //         x: 0,
    //         y: 0,
    //         z: 0,
    //     }
    // }
]