using backend.Contracts;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/todos")]
public sealed class TodosController(ITodoService todoService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IEnumerable<TodoItemResponse>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<TodoItemResponse>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await todoService.GetAllAsync(cancellationToken);
        return Ok(items.Select(TodoItemResponse.FromModel));
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType<TodoItemResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TodoItemResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await todoService.GetByIdAsync(id, cancellationToken);
        return item is null ? NotFound() : TodoItemResponse.FromModel(item);
    }

    [HttpPost]
    [Consumes("application/json")]
    [ProducesResponseType<TodoItemResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TodoItemResponse>> Create(CreateTodoRequest request, CancellationToken cancellationToken)
    {
        var item = await todoService.CreateAsync(request.Title, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, TodoItemResponse.FromModel(item));
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await todoService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
