import { useEffect, useState } from 'react';
import { loadCandidates } from '../services/loadCandidates';
import type { Candidate } from '../types/candidate';
import CandidateCard from '../components/CandidateCard';

function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyWithContact, setShowOnlyWithContact] = useState(false);
  const [sourceFilter, setSourceFilter] =
    useState<'hh_api' | 'p_local' | 'all'>('all');
  const [sortBy, setSortBy] =
    useState<'relevance_score' | 'found_skills'>('relevance_score');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [vacancy, setVacancy] = useState<any>(null);
  const [focusedSkills, setFocusedSkills] = useState<string[]>([]); 

  const exportSelectedCandidates = () => {
    const selected = candidates.filter(candidate =>
      selectedCandidates.includes(candidate.id)
    );
  
    const blob = new Blob(
      [JSON.stringify(selected, null, 2)],
      { type: 'application/json' }
    );
  
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected-candidates.json';
  
    a.click();
  
    URL.revokeObjectURL(url);  };

  const toggleCandidate = (id: string) => {
    setSelectedCandidates(prev =>
      prev.includes(id)
        ? prev.filter(candidateId => candidateId !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadCandidates();
        setCandidates(data.candidates);
        setVacancy(data.vacancy);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleFocusedSkill = (skillId: string) => {
    setFocusedSkills(prev => {
      if (prev.includes(skillId)) {
        return prev.filter(id => id !== skillId);
      }
  
      if (prev.length >= 2) {
        return prev;
      }
  
      return [...prev, skillId];
    });
  };

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error}</h1>; 

  console.log('Vacancy skills:', vacancy?.required_skills);
  console.log('Candidate skills:', candidates[0]?.skills_coverage);
  console.log('Focused:', focusedSkills);

  let filteredCandidates = [...candidates]; 

  if (focusedSkills.length > 0) {
    filteredCandidates = filteredCandidates.filter(candidate =>
      focusedSkills.every(skillId =>
        candidate.skills_coverage.some(
          skill => String(skill.skill_id) === skillId
        )
      )
    );
  }

  if (sourceFilter !== 'all') {
    filteredCandidates = filteredCandidates.filter(
      c => c.source === sourceFilter
    );
  }

  if (showOnlyWithContact) {
    filteredCandidates = filteredCandidates.filter(
      c => c.contact_available
    );
  }

  if (sortBy === 'relevance_score') {
    filteredCandidates = filteredCandidates.sort(
      (a, b) => b.relevance_score - a.relevance_score
    );
  }

  if (sortBy === 'found_skills') {
    filteredCandidates = filteredCandidates.sort((a, b) => {
      const aFound = a.skills_coverage.filter(
        s => s.status === 'found'
      ).length;

      const bFound = b.skills_coverage.filter(
        s => s.status === 'found'
      ).length;

      return bFound - aFound;
    });
  }

  if (focusedSkills.length > 0) {
    filteredCandidates = filteredCandidates.filter(candidate => {
      const result = focusedSkills.every(skillId =>
        candidate.skills_coverage.some(
          skill => String(skill.skill_id) === skillId
        )
      );
  
      console.log(
        candidate.display_name,
        result,
        candidate.skills_coverage.map(s => s.skill_id)
      );
  
      return result;
    });
  }

  return (
    <section className="filters" aria-label="Filters">
    <div className="filters__group">
      <button className="filters__toggle" onClick={() => setShowOnlyWithContact(prev => !prev)}>
        Только с контактами
      </button>

    <div className="filters__group">
      <label className="filters__option">
        <input
          type="radio"
          checked={sourceFilter === 'all'}
          onChange={() => setSourceFilter('all')}
          name="sourceFilter"
        />
        Все
      </label>

      <label className="filters__option">
        <input
          type="radio"
          checked={sourceFilter === 'hh_api'}
          onChange={() => setSourceFilter('hh_api')}
          name="sourceFilter"
        />
        HH.ru
      </label>

      <label className="filters__option">
        <input
          type="radio"
          checked={sourceFilter === 'p_local'}
          onChange={() => setSourceFilter('p_local')}
          name="sourceFilter"
        />
        Локальные
      </label>
    </div>

    <div className="filters__group">
      <label>
        <input
          type="radio"
          checked={sortBy === 'relevance_score'}
          onChange={() => setSortBy('relevance_score')}
        />
        По релевантности
      </label>

      <label>
        <input
          type="radio"
          checked={sortBy === 'found_skills'}
          onChange={() => setSortBy('found_skills')}
        />
        По навыкам
      </label> 
      </div>
      <button onClick={exportSelectedCandidates}>
        Экспорт JSON
      </button>

      {vacancy && (
  <div>
    <h2>{vacancy.title}</h2>

    {vacancy.required_skills.map((skill: any) => (
      <label key={skill.id}>
        <input
          type="checkbox"
          checked={focusedSkills.includes(skill.id)}
          onChange={() => toggleFocusedSkill(skill.id)}
        />

        {skill.name}

        {skill.importance === 'required'
          ? ' (required)'
          : ' (nice to have)'}
      </label>
       ))}
      </div>
      )}

      <header className="page__header">
        <h1>Кандидаты</h1>
      </header>
      
      {filteredCandidates.map(candidate => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          selected={selectedCandidates.includes(candidate.id)}
          onToggle={() => toggleCandidate(candidate.id)}
          focusedSkills={focusedSkills}
        />
      ))}
      
    </div>
    </section>
  );
}

export default CandidatesPage;