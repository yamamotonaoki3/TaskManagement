import { useTasks } from '../../hooks/useTasks';
import { KanbanColumn } from '../KanbanColumn/KanbanColumn';
import { Header } from '../Header/Header';
import styles from './KanbanBoard.module.css';

export function KanbanBoard() {
  const { columns, columnOrder, loading, error, query, setQuery, create } = useTasks();

  return (
    <div className={styles.wrapper}>
      <Header query={query} onQueryChange={setQuery} />
      <main className={styles.board}>
        {loading && <p className={styles.status}>読み込み中...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && (
          <div className={styles.columns}>
            {columnOrder.map((listName, index) => {
              const tasks = columns[listName] ?? [];
              const listId = tasks[0]?.listId ?? 0;
              return (
                <KanbanColumn
                  key={listName}
                  listId={listId}
                  listName={listName}
                  tasks={tasks}
                  isSearching={query.trim() !== ''}
                  showAddButton={index === 0}
                  onCreate={create}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
