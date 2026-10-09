using System.Collections.Concurrent;
using backend.Interfaces;
using backend.Models;

namespace backend.Repositories;
public sealed class InMemoryTodoRepository : ITodoRepository
{
    private readonly ConcurrentDictionary<Guid, TodoItem> _items = new();
    public Task<IReadOnlyList<TodoItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        IReadOnlyList<TodoItem> items = _items.Values
            .OrderBy(i => i.CreatedAt)
            .ThenBy(i => i.Id)
            .ToList();
        return Task.FromResult(items);
    }

    public Task<TodoItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        Task.FromResult(_items.GetValueOrDefault(id));

    public Task AddAsync(TodoItem item, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(item);

        if (!_items.TryAdd(item.Id, item))
        {
            throw new InvalidOperationException($"A to-do item with id '{item.Id}' already exists.");
        }
        return Task.CompletedTask;
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default) =>
        Task.FromResult(_items.TryRemove(id, out _));
}
