using BikeRent.Models.DTOs;

namespace BikeRent.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<UserDto?> GetUserByIdAsync(int userId);
        string GenerateJwtToken(int userId, string email, string role);
    }
}
