using BikeRent.Models.Entities;

namespace BikeRent.Repositories.Interfaces
{
    public interface IRentalStationRepository
    {
        Task<RentalStation?> GetByIdAsync(int id);
        Task<IEnumerable<RentalStation>> GetAllAsync();
        Task<RentalStation> CreateAsync(RentalStation station);
        Task<RentalStation> UpdateAsync(RentalStation station);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<int> GetAvailableBikesCountAsync(int stationId);
    }
}
