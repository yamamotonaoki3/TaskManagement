import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { TaskCreateRequest, TaskResponse, TaskStatusUpdateRequest, TaskUpdateRequest } from '../../types/task';
import { TaskCard } from '../TaskCard/TaskCard';
import { TaskCreateModal } from '../TaskCreateModal/TaskCreateModal';
import styles from './KanbanColumn.module.css';

interface KanbanColumnProps {
  listId: number;
  listName: string;
  tasks: TaskResponse[];
  isSearching: boolean;
  isOver: boolean;
  showAddButton: boolean;
  onCreate: (data: TaskCreateRequest) => Promise<void>;
  onStatusChange: (id: number, data: TaskStatusUpdateRequest) => Promise<void>;
  onUpdate: (id: number, data: TaskUpdateRequest) => Promise<void>;
}

export function KanbanColumn({ listId, listName, tasks, isSearching, isOver, showAddButton, onCreate, onStatusChange, onUpdate }: KanbanColumnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setNodeRef } = useDroppable({ id: `col-${listId}` });

  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{listName}</h2>
        {showAddButton && (
          <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>+ 追加</button>
        )}
      </div>
      <div ref={setNodeRef} className={`${styles.cards} ${isOver ? styles.over : ''}`}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <p className={styles.empty}>
              {isSearching ? '一致するタスクはありません' : 'カードはありません'}
            </p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={onStatusChange}
                onUpdate={onUpdate}
              />
            ))
          )}
        </SortableContext>
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
