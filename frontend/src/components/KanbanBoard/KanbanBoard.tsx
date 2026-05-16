import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
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
  const { columns, columnOrder, loading, error, query, setQuery, create, patchStatus, patchTask } = useTasks();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = Number(active.id);
    const targetListId = Number(over.id);
    const allTasks = Object.values(columns).flat();
    const task = allTasks.find(t => t.id === taskId);
    if (!task || task.listId === targetListId) return;
    const targetListName = columnOrder.find(name => (columns[name]?.[0]?.listId ?? 0) === targetListId) ?? '';
    const targetStatus = LIST_NAME_TO_STATUS[targetListName] ?? task.status;
    const targetTasks = allTasks.filter(t => t.listId === targetListId);
    patchStatus(taskId, { status: targetStatus, listId: targetListId, position: targetTasks.length });
  };

  return (
    <div className={styles.wrapper}>
      <Header query={query} onQueryChange={setQuery} />
      <main className={styles.board}>
        {loading && <p className={styles.status}>読み込み中...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
