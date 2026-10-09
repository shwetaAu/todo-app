import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, maxLength, pattern, required } from '@angular/forms/signals';
import { TODO_TITLE_MAX_LENGTH } from '../todos-item/todo';
import { TodoStore } from '../todos-item/todo-store';
 
@Component({
  imports: [FormField, FormRoot],
  selector: 'app-todo-form',
  styleUrl: './todo-form.scss',
  templateUrl: './todo-form.html',
})
export class TodoForm {
  private readonly store = inject(TodoStore);
 
  private readonly model = signal({ title: '' });
 
  protected readonly todoForm = form(
    this.model,
    (path) => {
      required(path.title, { message: 'Please enter a to-do item.' });
      pattern(path.title, /\S/, { message: 'Please enter a to-do item.' });
      maxLength(path.title, TODO_TITLE_MAX_LENGTH, {
        message: `Keep it under ${TODO_TITLE_MAX_LENGTH} characters.`,
      });
    },
    {
      submission: {
        action: async () => {
          if (await this.store.add(this.model().title)) {
            this.todoForm().reset({ title: '' });
          }
          return undefined;
        },
      },
    },
  );
}