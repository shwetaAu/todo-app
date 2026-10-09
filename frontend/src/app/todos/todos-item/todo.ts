export const TODO_TITLE_MAX_LENGTH = 200;

export interface Todo {
    readonly id: string;
    readonly title: string;
    readonly createdAt: string;
}

export interface CreateTodoRequest {
    readonly title: string;
}