import type { TaskResponse } from '../../types/task';
import { TaskCard } from '../TaskCard/TaskCard';
import styles from './KanbanColumn.module.css';

interface KanbanColumnProps {
  listName: string;
  tasks: TaskResponse[];
  isSearching: boolean;
}

export function KanbanColumn({ listName, tasks, isSearching }: KanbanColumnProps) {
  return (
    <div className={styles.column}>
      <h2 className={styles.heading}>{listName}</h2>
      <div className={styles.cards}>
        {tasks.length === 0 ? (
          <p className={styles.empty}>
            {isSearching ? '一致するタスクはありません' : 'カードはありません'}
          </p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
