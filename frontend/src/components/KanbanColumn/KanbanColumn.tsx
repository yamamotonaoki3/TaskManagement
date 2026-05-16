import { useState } from 'react';
import type { TaskCreateRequest, TaskResponse } from '../../types/task';
import { TaskCard } from '../TaskCard/TaskCard';
import { TaskCreateModal } from '../TaskCreateModal/TaskCreateModal';
import styles from './KanbanColumn.module.css';

interface KanbanColumnProps {
  listId: number;
  listName: string;
  tasks: TaskResponse[];
  isSearching: boolean;
  showAddButton: boolean;
  onCreate: (data: TaskCreateRequest) => Promise<void>;
}

export function KanbanColumn({ listId, listName, tasks, isSearching, showAddButton, onCreate }: KanbanColumnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{listName}</h2>
        {showAddButton && (
          <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>+ 追加</button>
        )}
      </div>
      <div className={styles.cards}>
        {tasks.length === 0 ? (
          <p className={styles.empty}>
            {isSearching ? '一致するタスクはありません' : 'カードはありません'}
          </p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
      {isModalOpen && (
        <TaskCreateModal
          listId={listId}
          onClose={() => setIsModalOpen(false)}
          onCreate={onCreate}
        />
      )}
    </div>
  );
}
