import manual_data from "RAManual_output.json";
import crimson_data from "Crimson_Output.json";
import { IChunk } from "~/models/merrick";

export function get_context(query_vector: number[]): string[] {
    const all_data = [...(manual_data as IChunk[]), ...(crimson_data as IChunk[])];
    
    // Compute cosine similarity for each chunk
    const scoredChunks = all_data.map(chunk => ({
        text: chunk.text,
        similarity: cosine_similarity(query_vector, chunk.chunk)
    }));
    
    // Sort by similarity in descending order
    scoredChunks.sort((a, b) => b.similarity - a.similarity);
    
    // Get the top 5 chunks
    const topChunks = scoredChunks.slice(0, 5).map(chunk => chunk.text);
    
    console.log(topChunks);
    return topChunks;
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