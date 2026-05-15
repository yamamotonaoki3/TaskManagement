import axios from 'axios';
import type { TaskResponse } from '../types/task';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});

export const fetchAllTasks = (): Promise<TaskResponse[]> =>
  api.get<TaskResponse[]>('/tasks').then((r) => r.data);

export const searchTasks = (q: string): Promise<TaskResponse[]> =>
  api.get<TaskResponse[]>('/tasks/search', { params: { q } }).then((r) => r.data);
