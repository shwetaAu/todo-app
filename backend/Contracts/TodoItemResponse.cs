using backend.Models;

namespace backend.Contracts;
public sealed record TodoItemResponse(Guid Id, string Title, DateTimeOffset CreatedAt)
{
    public static TodoItemResponse FromModel(TodoItem item) => new(item.Id, item.Title, item.CreatedAt);
}
