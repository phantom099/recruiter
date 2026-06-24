export type SkillStatus = 'found' | 'indirect' | 'not_found';

export interface SkillCoverage {
    skill_id: number;
    skill_name: string;
    status: SkillStatus;
    evidence: string[];
}

export interface Candidate {
    id: string;
    display_name: string;
    source: 'hh_api'| 'p_local';
    relevance_score: number;
    experience_years: number;
    current_title: string;
    location: string;
    contact_available: boolean;
    summary: string;
    explanation: string;
    skills_coverage: SkillCoverage[];
}

export interface VacancySkill {
    id: string;
    name: string;
    importance: 'required' | 'nice to have';
}

export interface Vacancy {
    id: string;
    title: string;
    company: string;
    decription: string;
    required_skills: VacancySkill[];
}

export interface CandidatesResponse {
    vacancy: Vacancy;
    candidates: Candidate[];
}
