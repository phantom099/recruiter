import type { Candidate } from '../types/candidate';
import { Link } from 'react-router-dom';
import SkillBadge from './SkillBadge';

type CandidateCardProps = {
  candidate: Candidate;
  selected: boolean;
  onToggle: () => void;
};

function CandidateCard({ candidate, selected, onToggle }: CandidateCardProps) {
  return (
    <Link to={`/candidate/${candidate.id}`} className="card">
        <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        onClick={(e) => e.stopPropagation()}
        />
      <h2>{candidate.display_name}</h2>
      <p>{candidate.current_title}</p>

      <p>Опыт: {candidate.experience_years} лет</p>
      <p>Score: {candidate.relevance_score}</p>

      <p>Источник: {candidate.source}</p>
      <p>Локация: {candidate.location}</p>

      <hr />

      <div>
        {candidate.skills_coverage.map(skill => (
          <SkillBadge
            key={skill.skill_id}
            name={skill.skill_name}
            status={skill.status}
          />
        ))}
      </div>

      <hr />

      <p>{candidate.summary}</p>
    </Link>
  );
}

export default CandidateCard;