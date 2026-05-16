import { useState } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragOverEvent } from '@dnd-kit/core';
import { useTasks } from '../../hooks/useTasks';
import { KanbanColumn } from '../KanbanColumn/KanbanColumn';
import { Header } from '../Header/Header';
import styles from './KanbanBoard.module.css';

const LIST_NAME_TO_STATUS: Record<string, 'todo' | 'in_progress' | 'done'> = {
  'やること': 'todo',
  '進行中': 'in_progress',
  '完了': 'done',
};

export function KanbanBoard() {
  const { lists, columns, columnOrder, loading, error, query, setQuery, create, patchStatus, patchTask } = useTasks();
  const [overColumnId, setOverColumnId] = useState<number | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) { setOverColumnId(null); return; }
    const overId = String(over.id);
    if (overId.startsWith('col-')) {
      setOverColumnId(Number(overId.replace('col-', '')));
    } else {
      const allTasks = Object.values(columns).flat();
      const overTask = allTasks.find(t => t.id === Number(overId));
      setOverColumnId(overTask ? overTask.listId : null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) { setOverColumnId(null); return; }

    const taskId = Number(active.id);
    const overId = String(over.id);
    const allTasks = Object.values(columns).flat();
    const activeTask = allTasks.find(t => t.id === taskId);
    if (!activeTask) { setOverColumnId(null); return; }

    if (overId.startsWith('col-')) {
      // カラムの空き領域にドロップ: カラム間移動
      const targetListId = Number(overId.replace('col-', ''));
      if (activeTask.listId !== targetListId) {
        const targetListName = lists.find(l => l.id === targetListId)?.name ?? '';
        const targetStatus = LIST_NAME_TO_STATUS[targetListName] ?? activeTask.status;
        const targetTasks = allTasks.filter(t => t.listId === targetListId);
        patchStatus(taskId, { status: targetStatus, listId: targetListId, position: targetTasks.length });
      }
    } else {
      // タスク上にドロップ
      const overTaskId = Number(overId);
      if (taskId !== overTaskId) {
        const overTask = allTasks.find(t => t.id === overTaskId);
        if (overTask) {
          if (activeTask.listId === overTask.listId) {
            // 同一カラム内: 並べ替え
            const columnTasks = columns[activeTask.listName] ?? [];
            const overIndex = columnTasks.findIndex(t => t.id === overTaskId);
            patchStatus(taskId, { status: activeTask.status, listId: activeTask.listId, position: overIndex });
          } else {
            // 別カラムのタスク上にドロップ: カラム間移動
            const targetListName = lists.find(l => l.id === overTask.listId)?.name ?? '';
            const targetStatus = LIST_NAME_TO_STATUS[targetListName] ?? activeTask.status;
            const targetTasks = allTasks.filter(t => t.listId === overTask.listId);
            patchStatus(taskId, { status: targetStatus, listId: overTask.listId, position: targetTasks.length });
          }
        }
      }
    }
    setOverColumnId(null);
  };

  return (
    <div className={styles.wrapper}>
      <Header query={query} onQueryChange={setQuery} />
      <main className={styles.board}>
        {loading && <p className={styles.status}>読み込み中...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && (
          <DndContext sensors={sensors} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            <div className={styles.columns}>
              {columnOrder.map((listName, index) => {
                const tasks = columns[listName] ?? [];
                const listId = lists.find(l => l.name === listName)?.id ?? 0;
                return (
                  <KanbanColumn
                    key={listName}
                    listId={listId}
                    listName={listName}
                    tasks={tasks}
                    isSearching={query.trim() !== ''}
                    isOver={overColumnId === listId}
                    showAddButton={index === 0}
                    onCreate={create}
                    onStatusChange={patchStatus}
                    onUpdate={patchTask}
                  />
                );
              })}
            </div>
          </DndContext>
        )}
      </main>
    </div>
  );
}
