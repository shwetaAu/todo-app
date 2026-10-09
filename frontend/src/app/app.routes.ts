import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        title: 'To-do list',
        loadComponent: () => import('./todos/todo-list/todo-list').then((m) => m.TodoList),
    },
    {
        path: '**', redirectTo: ''
    }
];
