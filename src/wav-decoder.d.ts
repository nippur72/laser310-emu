// Type definitions for wav-encoder 1.3
// Project: https://github.com/mohayonao/wav-encoder/
// Definitions by: Candid Dauth <https://github.com/cdauth>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'wav-decoder' {
    interface AudioData {
        sampleRate: number;
        channelData: Float32Array[];
    }

    interface Options {
        bitDepth: number;
        float: boolean;
        symmetric: boolean;
    }

    export const decode: {
        (audioData: ArrayBuffer): Promise<any>;
        sync: (audioData: ArrayBuffer) => any;
    };
}



