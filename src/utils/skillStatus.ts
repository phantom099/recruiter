import type { Candidate } from '../types/candidate';

export function getSkillStatus (candidate: Candidate) {
    const found = candidate.skills_coverage.filter(skill => skill.status ==='found').length;
    const indirect = candidate.skills_coverage.filter(skill => skill.status ==='indirect').length;
    const notFound = candidate.skills_coverage.filter(skill => skill.status ==='not_found').length;

    return {
        found,
        indirect,
        notFound,
    };
}