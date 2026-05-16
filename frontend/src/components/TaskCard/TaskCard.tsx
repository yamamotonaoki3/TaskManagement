import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { TaskResponse, TaskStatusUpdateRequest, TaskUpdateRequest } from '../../types/task';
import { TaskDetailModal } from '../TaskDetailModal/TaskDetailModal';
import styles from './TaskCard.module.css';

const PRIORITY_LABEL: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

const NEXT_STATUS: Record<string, 'todo' | 'in_progress' | 'done'> = {
  todo: 'in_progress',
  in_progress: 'done',
  done: 'todo',
};

const STATUS_LABEL: Record<string, string> = {
  todo: '未着手',
  in_progress: '進行中',
  done: '完了',
};

interface TaskCardProps {
  task: TaskResponse;
  onStatusChange: (id: number, data: TaskStatusUpdateRequest) => Promise<void>;
  onUpdate: (id: number, data: TaskUpdateRequest) => Promise<void>;
}

export function TaskCard({ task, onStatusChange, onUpdate }: TaskCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    attributes: { roleDescription: 'draggable task card' },
  });
  const style = { transform: CSS.Translate.toString(transform) };

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStatusChange(task.id, { status: NEXT_STATUS[task.status] });
  };

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
            className={styles.statusButton}
            data-status={task.status}
            onClick={handleStatusClick}
            title={`次のステータスへ: ${STATUS_LABEL[NEXT_STATUS[task.status]]}`}
          >
            {STATUS_LABEL[task.status]}
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
        />
      )}
    </>
  );
}
