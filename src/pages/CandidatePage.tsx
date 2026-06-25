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
    <div className="page candidate-page">
      
  
      <header className="page__header candidate-page__header">
        <h1 className="page__title">Профиль кандидата</h1>
      </header>
  
  
      <section className="candidate-card candidate-card--full">
  
        <h2 className="candidate-card__title">
          {candidate.display_name}
        </h2>
  
        <p className="candidate-card__subtitle">
          {candidate.current_title}
        </p>
  
        <div className="candidate-card__meta">
          <p>Score: {candidate.relevance_score}</p>
          <p>Локация: {candidate.location}</p>
          <p>Опыт: {candidate.experience_years} лет</p>
          <p>Источник: {sourceName}</p>
          <p>
            Контактные данные:{" "}
            {candidate.contact_available ? "Доступны" : "Недоступны"}
          </p>
        </div>
      </section>
  

      <section className="candidate-section">
        <h2 className="candidate-section__title">Почему рекомендован</h2>
        <p className="candidate-section__text">
          {candidate.explanation}
        </p>
      </section>

      <section className="candidate-section candidate-section--skills">
        
        <h2 className="candidate-section__title">Навыки</h2>
  
        <div className="skills-list">
          {candidate.skills_coverage.map(skill => (
            <details
              key={skill.skill_id}
              className="skill-item"
            >
              <summary className="skill-item__summary">
                <SkillBadge
                  name={skill.skill_name}
                  status={skill.status}
                />
              </summary>
  
              <div className="skill-item__details">
                <ul className="skill-item__evidence">
                  {skill.evidence.length > 0 ? (
                    skill.evidence.map((item, idx) => (
                      <li key={idx} className="skill-item__evidence-item">
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="skill-item__evidence-empty">
                      Подтверждений нет
                    </li>
                  )}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </section>
  
    </div>
  );
}
export default CandidatePage;