import { useTasks } from '../../hooks/useTasks';
import { KanbanColumn } from '../KanbanColumn/KanbanColumn';
import { Header } from '../Header/Header';
import styles from './KanbanBoard.module.css';

export function KanbanBoard() {
  const { columns, columnOrder, loading, error, query, setQuery } = useTasks();

  return (
    <div className={styles.wrapper}>
      <Header query={query} onQueryChange={setQuery} />
      <main className={styles.board}>
        {loading && <p className={styles.status}>読み込み中...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && (
          <div className={styles.columns}>
            {columnOrder.map((listName) => (
              <KanbanColumn
                key={listName}
                listName={listName}
                tasks={columns[listName] ?? []}
                isSearching={query.trim() !== ''}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
