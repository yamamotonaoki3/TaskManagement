export type Priority = 'high' | 'medium' | 'low' | null;

export interface TaskResponse {
  id: number;
  listId: number;
  listName: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: Priority;
  archived: boolean;
  position: number;
  createdAt: string;
}

export type KanbanColumns = Record<string, TaskResponse[]>;

export interface TaskCreateRequest {
  listId: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'high' | 'medium' | 'low';
}
