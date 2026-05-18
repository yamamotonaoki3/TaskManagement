import './App.css';

import { useState } from 'react';

import { CompletedTasksPage } from './components/CompletedTasksPage/CompletedTasksPage';
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard';

type Page = 'board' | 'completed';

function App() {
  const [page, setPage] = useState<Page>('board');

  return page === 'board'
    ? <KanbanBoard onOpenCompleted={() => setPage('completed')} />
    : <CompletedTasksPage onBack={() => setPage('board')} />;
}

export default App;
