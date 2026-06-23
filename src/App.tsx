import { useEffect, useState } from 'react';
import { loadCandidates } from './services/loadCandidates';
import type { Candidate } from './types/candidate';
import CandidateCard from './components/CandidateCard';

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyWithContact, setShowOnlyWithContact] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<'hh_api' | 'p_local' | 'all'>('all');
  const [sortBy, setSortBy] = useState<'relevance_score' | 'found_skills'>('relevance_score');

  let filteredCandidates = [...candidates];
  if (sourceFilter !== 'all') {
    filteredCandidates = filteredCandidates.filter(candidate => candidate.source === sourceFilter)
  }; 
  if (showOnlyWithContact) {
    filteredCandidates = filteredCandidates.filter(candidate => candidate.contact_available)
  }; 

  if (sortBy === 'relevance_score') {
    filteredCandidates.sort((a, b) => b.relevance_score - a.relevance_score)
  }
  if (sortBy === 'found_skills') {
    filteredCandidates.sort((a, b) => {
      const aFoundSkills = a.skills_coverage.filter(skill => skill.status === 'found').length;
      const bFoundSkills = b.skills_coverage.filter(skill => skill.status === 'found').length;
      return bFoundSkills - aFoundSkills;
    })
  }

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

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return <h1>Error: {error}</h1>;
  }

  return (
    <div>
      <button onClick={() => setShowOnlyWithContact(prev => !prev)}>
        Только с контактами 
      </button>
      <label>
        <input 
        type="radio" 
        name='sourceFilter' 
        value='all' 
        checked={sourceFilter ==='all'} 
        onChange={() => setSourceFilter('all')}/> 
        Все
      </label>
      <label>
        <input 
        type="radio" 
        name='sourceFilter' 
        value='hh_api' 
        checked={sourceFilter ==='hh_api'} 
        onChange={() => setSourceFilter('hh_api')}/> 
        HH.ru
      </label>
      <label>
        <input 
        type="radio" 
        name='sourceFilter' 
        value='p_local' 
        checked={sourceFilter ==='p_local'} 
        onChange={() => setSourceFilter('p_local')}/> 
        Локальные
      </label>
      <label>
  <input
    type="radio"
    name="sortBy"
    value="relevance"
    checked={sortBy === 'relevance_score'}
    onChange={() => setSortBy('relevance_score')}
  />
  По релевантности
</label>

<label>
  <input
    type="radio"
    name="sortBy"
    value="found_skills"
    checked={sortBy === 'found_skills'}
    onChange={() => setSortBy('found_skills')}
  />
  По найденным навыкам
</label>
      <h1>Кандидаты</h1>

      {filteredCandidates.map(candidate => (
        <CandidateCard key={candidate.id} candidate={candidate}/>
      ))}
    </div>
  )
   
}

export default App
