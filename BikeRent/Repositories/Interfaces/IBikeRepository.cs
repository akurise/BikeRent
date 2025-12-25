using BikeRent.Models.Entities;

namespace BikeRent.Repositories.Interfaces
{
    public interface IBikeRepository
    {
        Task<Bike?> GetByIdAsync(int id);
        Task<IEnumerable<Bike>> GetAllAsync();
        Task<IEnumerable<Bike>> GetAvailableAsync();
        Task<IEnumerable<Bike>> GetByStationIdAsync(int stationId);
        Task<IEnumerable<Bike>> GetByTypeAsync(string type);
        Task<IEnumerable<Bike>> GetByStationAndTypeAsync(int stationId, string type);
        Task<Bike> CreateAsync(Bike bike);
        Task<Bike> UpdateAsync(Bike bike);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
