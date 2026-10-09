import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '../src/app/todos/todo-list/todo-list',
        title: 'To-do list',
        loadComponent: () => import('./todos/todo-list/todo-list').then((m) => m.TodoList),
    },
    {
        path: '**', redirectTo: ''
    }
];
