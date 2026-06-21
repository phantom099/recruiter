import { useEffect, useState } from 'react';
import { loadCandidates } from './services/loadCandidates';
import type { Candidate } from './types/candidate';

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <h1>Кандидаты</h1>

      {candidates.map(candidate => (
        <div key={candidate.id}>
          <h2>{candidate.diplay_name}</h2>
          <p>{candidate.current_title}</p>
          <p> Опыт: {''} {candidate.experience_years} {''} лет</p>
          <p>Score: {candidate.relevance_score}</p>
        </div>
      ))}
    </div>
  )
   
}

export default App
