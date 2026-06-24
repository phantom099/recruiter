import { Routes, Route } from 'react-router-dom';
import CandidatesPage from './pages/CandidatesPage';
import CandidatePage from './pages/CandidatePage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<CandidatesPage />} />
      <Route path='/candidate/:id' element={<CandidatePage />} />
    </Routes>
  )
}

export default App
