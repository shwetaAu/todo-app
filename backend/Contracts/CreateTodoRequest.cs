using System.ComponentModel.DataAnnotations;

namespace backend.Contracts;
public sealed record CreateTodoRequest
{
    public const int TitleMaxLength = 200;

    [Required(AllowEmptyStrings = false)]
    [StringLength(TitleMaxLength)]
    [RegularExpression(@".*\S.*", ErrorMessage = "The Title field must contain non-whitespace characters.")]
    public string Title { get; init; } = string.Empty;
}
