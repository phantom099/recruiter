import type { Candidate } from '../types/candidate';
import { Link } from 'react-router-dom';
import SkillBadge from './SkillBadge';

type CandidateCardProps = {
  candidate: Candidate;
  selected: boolean;
  onToggle: () => void;
  focusedSkills: string[];
};

function CandidateCard({ candidate, selected, onToggle,  focusedSkills}: CandidateCardProps) {
  return (
    <Link to={`/candidate/${candidate.id}`} className="card">
        <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Open profile of ${candidate.display_name}`}
        />
    <header className="card-header">  
      <h2 className="card__title">{candidate.display_name}</h2>
      <p className="card__subtitle">{candidate.current_title}</p>
    </header>
    
    <section className="card__meta">
      <p className="card__item">Опыт: {candidate.experience_years} лет</p>
      <p className="card__item">Score: {candidate.relevance_score}</p>

      <p className="card__item">Источник: {candidate.source}</p>
      <p className="card__item">Локация: {candidate.location}</p>
    </section>

      <section className="card__skills">
        {candidate.skills_coverage.map(skill => {
        const isFocused = focusedSkills.includes(String(skill.skill_id));

        return (
        <SkillBadge
        key={skill.skill_id}
        name={skill.skill_name}
        status={skill.status}
        className={isFocused ? 'focused' : ''}
         />
          );
        })}
        </section>

        <footer className="card-footer">
            <p className="card__item">{candidate.summary}</p>
        </footer>
    </Link>
  );
}

export default CandidateCard;