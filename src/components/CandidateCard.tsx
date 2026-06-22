import type { Candidate } from '../types/candidate';
import { getSkillStatus } from '../utils/skillStatus';

type CandidateCardProps = {
    candidate: Candidate;
};

function CandidateCard ({ candidate}: CandidateCardProps) {

    const stats = getSkillStatus(candidate)

    return (
        <div>
            <h2>{candidate.diplay_name}</h2>
            <p>{candidate.current_title}</p>
            <p> Опыт: {''} {candidate.experience_years} {''} лет</p>
            <p>Score: {candidate.relevance_score}</p>
            <hr />
            <p>Found: {stats.found}</p>
            <p>Indirect: {stats.indirect}</p>
            <p>Not found: {stats.notFound}</p>
            <hr />
            <hr />
        </div>
    );
}

export default CandidateCard;