import { useState } from 'react';
import './App.css';

import { KanbanBoard } from './components/KanbanBoard/KanbanBoard';
import { CompletedTasksPage } from './components/CompletedTasksPage/CompletedTasksPage';

type Page = 'board' | 'completed';

function App() {
  const [page, setPage] = useState<Page>('board');

  return page === 'board'
    ? <KanbanBoard onOpenCompleted={() => setPage('completed')} />
    : <CompletedTasksPage onBack={() => setPage('board')} />;
}

export default App;
