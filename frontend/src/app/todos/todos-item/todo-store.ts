import { computed, inject, PendingTasks, Service, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { Todo } from '../todos-item/todo';
import { TodoApi } from '../todos-item/todo-api';
 
@Service({ autoProvided: false })

export class TodoStore {

  private readonly api = inject(TodoApi);
  private readonly pendingTasks = inject(PendingTasks); 
  private readonly todosResource = rxResource({ stream: () => this.api.getTodos() });
  private readonly deletingIds = signal<ReadonlySet<string>>(new Set());
 
  readonly todos = computed<readonly Todo[]>(() =>
    this.todosResource.hasValue() ? this.todosResource.value() : [],
  );

  readonly isLoading = this.todosResource.isLoading;
  readonly loadFailed = computed(() => this.todosResource.status() === 'error');
  readonly actionError = signal<string | null>(null);
 
  isDeleting(id: string): boolean {
    return this.deletingIds().has(id);
  }
 
  reload(): void {
    this.todosResource.reload();
  }
 
  async add(title: string): Promise<boolean> {
    this.actionError.set(null);
    const done = this.pendingTasks.add();
    try {
      const created = await firstValueFrom(this.api.createTodo({ title: title.trim() }));
      this.todosResource.update((todos) => [...(todos ?? []), created]);
      return true;
    } catch {
      this.actionError.set('Could not add the item. Please try again.');
      return false;
    } finally {
      done();
    }
  }
 
  async remove(id: string): Promise<void> {
    this.actionError.set(null);
    this.deletingIds.update((ids) => new Set(ids).add(id));
    const done = this.pendingTasks.add();
    try {
      await firstValueFrom(this.api.deleteTodo(id), { defaultValue: undefined });
      this.todosResource.update((todos) => todos?.filter((t) => t.id !== id));
    } catch {
      this.actionError.set('Could not delete the item. Please try again.');
    } finally {
      this.deletingIds.update((ids) => {
        const next = new Set(ids);
        next.delete(id);
        return next;
      });
      done();
    }
  }
}