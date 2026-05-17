import axios from 'axios';
import type { ListCreateRequest, ListResponse, TaskCreateRequest, TaskResponse, TaskStatusUpdateRequest, TaskUpdateRequest } from '../types/task';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});

export const fetchAllLists = (): Promise<ListResponse[]> =>
  api.get<ListResponse[]>('/lists').then((r) => r.data);

export const createList = (data: ListCreateRequest): Promise<ListResponse> =>
  api.post<ListResponse>('/lists', data).then((r) => r.data);

export const fetchAllTasks = (): Promise<TaskResponse[]> =>
  api.get<TaskResponse[]>('/tasks').then((r) => r.data);

export const searchTasks = (q: string): Promise<TaskResponse[]> =>
  api.get<TaskResponse[]>('/tasks/search', { params: { q } }).then((r) => r.data);

export const createTask = (data: TaskCreateRequest): Promise<TaskResponse> =>
  api.post<TaskResponse>('/tasks', data).then((r) => r.data);

export const updateTaskStatus = (id: number, data: TaskStatusUpdateRequest): Promise<TaskResponse> =>
  api.patch<TaskResponse>(`/tasks/${id}/status`, data).then((r) => r.data);

export const updateTask = (id: number, data: TaskUpdateRequest): Promise<TaskResponse> =>
  api.patch<TaskResponse>(`/tasks/${id}`, data).then((r) => r.data);

export const reorderTasks = (listId: number, taskIds: number[]): Promise<void> =>
  api.patch(`/lists/${listId}/tasks/reorder`, { taskIds }).then(() => {});
