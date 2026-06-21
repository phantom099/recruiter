import type { CandidatesResponse } from '../types/candidate';

export const loadCandidates = async (): Promise<CandidatesResponse> => {
    const response = await fetch ('/candidates.sample.json');
    if (!response.ok) {
        throw new Error (`Failed to load candidates: ${response.statusText}`);
    }

    return response.json();
};