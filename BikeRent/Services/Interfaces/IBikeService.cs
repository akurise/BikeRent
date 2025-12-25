using BikeRent.Models.DTOs;

namespace BikeRent.Services.Interfaces
{
    public interface IBikeService
    {
        Task<IEnumerable<BikeDto>> GetAllBikesAsync();
        Task<BikeDto?> GetBikeByIdAsync(int id);
        Task<IEnumerable<BikeDto>> GetAvailableBikesAsync();
        Task<IEnumerable<BikeDto>> GetBikesByFiltersAsync(int? stationId, string? type);
        Task<BikeDto> CreateBikeAsync(CreateBikeDto createBikeDto);
        Task<BikeDto?> UpdateBikeAsync(int id, UpdateBikeDto updateBikeDto);
        Task<bool> DeleteBikeAsync(int id);
    }
}
