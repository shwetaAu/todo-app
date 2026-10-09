import { Component, inject } from '@angular/core';
import { TodoForm } from '../todo-form/todo-form';
import { TodoStore } from '../todos-item/todo-store';

@Component({
  imports: [TodoForm],
  providers: [TodoStore],
  selector: 'app-todo-list',
  styleUrl: './todo-list.scss',
  templateUrl: './todo-list.html',
})
export class TodoList {
  protected readonly store = inject(TodoStore);
}
