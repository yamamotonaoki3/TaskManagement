import { useState, useEffect, useCallback } from 'react';
import { fetchAllTasks, searchTasks, createTask, updateTaskStatus, updateTask } from '../api/taskApi';
import type { KanbanColumns, TaskCreateRequest, TaskResponse, TaskStatusUpdateRequest, TaskUpdateRequest } from '../types/task';

function groupByListName(tasks: TaskResponse[]): { columns: KanbanColumns; columnOrder: string[] } {
  const map = new Map<string, TaskResponse[]>();
  for (const task of tasks) {
    if (!map.has(task.listName)) {
      map.set(task.listName, []);
    }
    map.get(task.listName)!.push(task);
  }
  return {
    columns: Object.fromEntries(map),
    columnOrder: [...map.keys()],
  };
}

export function useTasks() {
  const [query, setQuery] = useState('');
  const [columns, setColumns] = useState<KanbanColumns>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    const apiCall = query.trim() === '' ? fetchAllTasks() : searchTasks(query.trim());
    return apiCall
      .then((tasks) => {
        const { columns, columnOrder } = groupByListName(tasks);
        setColumns(columns);
        setColumnOrder(columnOrder);
        setError(null);
      })
      .catch(() => setError('データの取得に失敗しました。バックエンドが起動しているか確認してください。'))
      .finally(() => setLoading(false));
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => { refresh(); }, 300);
    return () => clearTimeout(timer);
  }, [refresh]);

  const create = async (data: TaskCreateRequest) => {
    await createTask(data);
    await refresh();
  };

  const patchStatus = async (id: number, data: TaskStatusUpdateRequest) => {
    await updateTaskStatus(id, data);
    await refresh();
  };

  const patchTask = async (id: number, data: TaskUpdateRequest) => {
    await updateTask(id, data);
    await refresh();
  };

  return { columns, columnOrder, loading, error, query, setQuery, create, patchStatus, patchTask };
}
