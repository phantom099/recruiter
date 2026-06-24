import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { loadCandidates } from '../services/loadCandidates';
import type { Candidate } from '../types/candidate';
import SkillBadge from '../components/SkillBadge';

function CandidatePage() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadCandidates();

      const found = data.candidates.find(
        c => c.id === String(id)
      );
      setCandidate(found ?? null);
    };

    fetchData();
  }, [id]);

  if (!candidate) return <h1>Loading...</h1>;
  const sourceName = candidate.source === 'hh_api' ? 'HH.ru' : 'Local Database';
  
  return (
    <div>
      <h1>Профиль кандидата</h1>  
      <h3>{candidate.display_name}</h3>
      <p>{candidate.current_title}</p>
      <p>Score: {candidate.relevance_score}</p>
      <p>{candidate.location}</p>
      <p>Опыт(лет): {candidate.experience_years}</p>
      <p>Источник: {sourceName}</p>
      <p>Контактные данные: {candidate.contact_available ? 'Доступны' : 'Недоступны'}</p>
      <h2>Почему рекомендован</h2>
      <p>{candidate.explanation}</p>
      <h2>Навыки</h2>
      <div>
  {candidate.skills_coverage.map(skill => (
    <details key={skill.skill_id}>
      <summary>
        <SkillBadge
          name={skill.skill_name}
          status={skill.status}
        />
      </summary>

      <ul>
        {skill.evidence.length > 0 ? (
          skill.evidence.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))
        ) : (
          <li>Подтверждений нет</li>
        )}
      </ul>
    </details>
  ))}
</div>
    </div>
  );
}

export default CandidatePage;