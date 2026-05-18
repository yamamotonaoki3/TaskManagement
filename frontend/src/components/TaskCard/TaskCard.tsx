import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskResponse, TaskUpdateRequest } from '../../types/task';
import { TaskDetailModal } from '../TaskDetailModal/TaskDetailModal';
import styles from './TaskCard.module.css';

const PRIORITY_LABEL: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

interface TaskCardProps {
  task: TaskResponse;
  onUpdate: (id: number, data: TaskUpdateRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    attributes: { roleDescription: 'draggable task card' },
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
        onClick={() => !isDragging && setIsDetailOpen(true)}
      >
        <div className={styles.cardTop}>
          {task.priority && (
            <span className={styles.badge} data-priority={task.priority}>
              {PRIORITY_LABEL[task.priority]}
            </span>
          )}
          <button
            className={styles.deleteBtn}
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('このタスクを削除しますか？')) {
                onDelete(task.id);
              }
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="タスクを削除"
          >
            ×
          </button>
        </div>
        <p className={styles.title}>{task.title}</p>
        {task.dueDate && (
          <p className={styles.due}>期限: {task.dueDate}</p>
        )}
      </div>
      {isDetailOpen && (
        <TaskDetailModal
          task={task}
          onClose={() => setIsDetailOpen(false)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
