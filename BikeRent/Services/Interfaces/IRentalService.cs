using BikeRent.Models.DTOs;

namespace BikeRent.Services.Interfaces
{
    public interface IRentalService
    {
        Task<RentalDto> StartRentalAsync(int userId, StartRentalDto startRentalDto);
        Task<RentalDto> FinishRentalAsync(int userId, FinishRentalDto finishRentalDto);
        Task<RentalDto?> GetActiveRentalAsync(int userId);
        Task<IEnumerable<RentalDto>> GetRentalHistoryAsync(int userId);
        Task<IEnumerable<RentalDto>> GetAllRentalsAsync(); // Admin only
    }
}
