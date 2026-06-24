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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadCandidates();
        setCandidates(data.candidates);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  let filteredCandidates = [...candidates];

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

  return (
    <div>
      <button onClick={() => setShowOnlyWithContact(prev => !prev)}>
        Только с контактами
      </button>

      <label>
        <input
          type="radio"
          checked={sourceFilter === 'all'}
          onChange={() => setSourceFilter('all')}
        />
        Все
      </label>

      <label>
        <input
          type="radio"
          checked={sourceFilter === 'hh_api'}
          onChange={() => setSourceFilter('hh_api')}
        />
        HH.ru
      </label>

      <label>
        <input
          type="radio"
          checked={sourceFilter === 'p_local'}
          onChange={() => setSourceFilter('p_local')}
        />
        Локальные
      </label>

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

      <h1>Кандидаты</h1>

      {filteredCandidates.map(candidate => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
        />
      ))}
    </div>
  );
}

export default CandidatesPage;