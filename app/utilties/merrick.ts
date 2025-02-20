import manual_data from "RAManual_output.json";
import crimson_data from "Crimson_Output.json";
import { IChunk } from "~/models/merrick";

export function get_context(query_vector: number[]): string {
    let closest_cos = -1;
    let closest_txt = "";
    const man_data = manual_data as IChunk[]
    for (let i = 0; i < man_data.length; i++) {
        const cos = cosine_similarity(query_vector, man_data[i].context);
        if (cos > closest_cos) {
            closest_cos = cos;
            closest_txt = man_data[i].text;
        }
    }

    const crim_data = crimson_data as IChunk[]
    for (let i = 0; i < crim_data.length; i++) {
        const cos = cosine_similarity(query_vector, crim_data[i].context);
        if (cos > closest_cos) {
            closest_cos = cos;
            closest_txt = crim_data[i].text;
        }
    }

    return closest_txt;
}

function cosine_similarity(v1: number[], v2: number[]): number {
    return dot_product(v1, v2) / (magnitude(v1) * magnitude(v2));
}

function dot_product(v1: number[], v2: number[]): number {
    let dp = 0;
    for (let i = 0; i < v1.length; i++) {
        dp += v1[i] * v2[i];
    }
    return dp;
}

function magnitude(v: number[]): number {
    let m = 0;
    for (const x of v) {
        m += x ** 2;
    }
    return m ** .5;
}