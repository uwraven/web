
const INTERPOLATIONS = {
    "LINEAR": 0,
    "SIN": 1,
}

const defaultOffset = {x: 0, y: 0, z: 0}
const defaultRotation = {x: 0, y: 0, z: 0}
const defaultScale = 1;

const metal = {
    reflectivity: 0.5,
    metalness: 0.95,
    roughness: 0.5,
    flatShading: false,
    color: "white"
};

export {
    INTERPOLATIONS,
    defaultRotation,
    defaultOffset,
    defaultScale
}

const models = [
    {
        src: 'Payload_Fairing_rev1',
        origin: {x: 0, y: 100, z: 0},
        rotation: {x: 0, y: 0, z: 0},
        easing: INTERPOLATIONS.LINEAR,
        materialProperties: metal,
        keyframes: [
            {
                time: 1,
            },
            {
                time: 1.5,
            },
            {
                time: 2.5,
                offset: {
                    x: 0,
                    y: -75,
                    z: 0,
                },
                rotation: {
                    x: -Math.PI / 8,
                    y: 0,
                    z: 0
                },
                scale: 5,
            },
            {
                time: 3.5,
                offset: {
                    x: 0,
                    y: -50,
                    z: 0,
                },
                rotation: {
                    x: -Math.PI / 8,
                    y: 0,
                    z: 0
                },
                scale: 5,
            },
            {
                time: 4.5,
                offset: {
                    x: 0,
                    y: 0,
                    z: 0,
                }
            },
            {
                time: 5.0,
                offset: {
                    x: 0,
                    y: 100,
                    z: 0,
                }
            }
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
        easing: INTERPOLATIONS.LINEAR, 
        materialProperties: metal,
        keyframes: [
            {
                time: 1,
                offset: {
                    x: 0,
                    y: 0,
                    z: 0
                },
            },
            {
                time: 2,
                offset: {
                    x: 0,
                    y: -300,
                    z: 0,
                }
            },
            {
                time: 3.0,
                offset: {
                    x: 0,
                    y: -300,
                    z: 0,
                }
            },
        
            {
                time: 4.5,
                offset: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                scale: 1
            },
            {
                time: 5.5,
                scale: 2,
                rotation: {
                    x: -Math.PI / 12,
                    y: 0,
                    z: Math.PI / 12,
                }
            }

        ]
    },
]

models.map((model) => {
    if (!model.origin) {
        console.warn("No origin provided for model: ", model.src)
        model.origin = defaultOffset
    }
    if (model.easing === undefined) {
        console.warn("No easing mode provided for model: ", model.src);
        model.easing = INTERPOLATIONS.LINEAR
    }
    if (!model.rotation) {
        model.rotation = defaultRotation
    }
    model.keyframes.map((frame) => {
        if (!frame.offset) frame.offset = defaultOffset
        if (!frame.rotation) frame.rotation = defaultRotation
        if (!frame.scale) frame.scale = defaultScale
        return frame;
    })
})

console.log(models)

export default models;