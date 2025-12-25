using BikeRent.Models.Entities;

namespace BikeRent.Repositories.Interfaces
{
    public interface IRentalRepository
    {
        Task<Rental?> GetByIdAsync(int id);
        Task<IEnumerable<Rental>> GetAllAsync();
        Task<IEnumerable<Rental>> GetByUserIdAsync(int userId);
        Task<Rental?> GetActiveRentalByUserIdAsync(int userId);
        Task<Rental?> GetActiveRentalByBikeIdAsync(int bikeId);
        Task<IEnumerable<Rental>> GetHistoryByUserIdAsync(int userId);
        Task<Rental> CreateAsync(Rental rental);
        Task<Rental> UpdateAsync(Rental rental);
        Task<bool> DeleteAsync(int id);
    }
}
