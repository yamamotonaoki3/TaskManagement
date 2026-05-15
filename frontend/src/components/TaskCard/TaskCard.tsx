import type { TaskResponse } from '../../types/task';
import styles from './TaskCard.module.css';

const PRIORITY_LABEL: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

interface TaskCardProps {
  task: TaskResponse;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className={styles.card}>
      {task.priority && (
        <span className={styles.badge} data-priority={task.priority}>
          {PRIORITY_LABEL[task.priority]}
        </span>
      )}
      <p className={styles.title}>{task.title}</p>
      {task.dueDate && (
        <p className={styles.due}>期限: {task.dueDate}</p>
      )}
    </div>
  );
}
