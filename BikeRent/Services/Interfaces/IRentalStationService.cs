using BikeRent.Models.DTOs;

namespace BikeRent.Services.Interfaces
{
    public interface IRentalStationService
    {
        Task<IEnumerable<RentalStationDto>> GetAllStationsAsync();
        Task<RentalStationDto?> GetStationByIdAsync(int id);
        Task<RentalStationDto> CreateStationAsync(CreateRentalStationDto createStationDto);
        Task<RentalStationDto?> UpdateStationAsync(int id, UpdateRentalStationDto updateStationDto);
        Task<bool> DeleteStationAsync(int id);
    }
}
