import { useState, useEffect } from 'react';
import { fetchAllTasks, searchTasks } from '../api/taskApi';
import type { KanbanColumns, TaskResponse } from '../types/task';

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      const apiCall = query.trim() === '' ? fetchAllTasks() : searchTasks(query.trim());
      apiCall
        .then((tasks) => {
          const { columns, columnOrder } = groupByListName(tasks);
          setColumns(columns);
          setColumnOrder(columnOrder);
          setError(null);
        })
        .catch(() => setError('データの取得に失敗しました。バックエンドが起動しているか確認してください。'))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return { columns, columnOrder, loading, error, query, setQuery };
}
