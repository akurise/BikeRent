using BikeRent.Data;
using BikeRent.Models.Entities;
using BikeRent.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BikeRent.Repositories
{
    public class RentalRepository : IRentalRepository
    {
        private readonly AppDbContext _context;

        public RentalRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Rental?> GetByIdAsync(int id)
        {
            return await _context.Rentals
                .Include(r => r.User)
                .Include(r => r.Bike)
                .ThenInclude(b => b.Station)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Rental>> GetAllAsync()
        {
            return await _context.Rentals
                .Include(r => r.User)
                .Include(r => r.Bike)
                .ThenInclude(b => b.Station)
                .OrderByDescending(r => r.StartTime)
                .ToListAsync();
        }

        public async Task<IEnumerable<Rental>> GetByUserIdAsync(int userId)
        {
            return await _context.Rentals
                .Include(r => r.Bike)
                .ThenInclude(b => b.Station)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.StartTime)
                .ToListAsync();
        }

        public async Task<Rental?> GetActiveRentalByUserIdAsync(int userId)
        {
            return await _context.Rentals
                .Include(r => r.Bike)
                .ThenInclude(b => b.Station)
                .FirstOrDefaultAsync(r => r.UserId == userId && r.Status == "Active");
        }

        public async Task<Rental?> GetActiveRentalByBikeIdAsync(int bikeId)
        {
            return await _context.Rentals
                .Include(r => r.User)
                .Include(r => r.Bike)
                .FirstOrDefaultAsync(r => r.BikeId == bikeId && r.Status == "Active");
        }

        public async Task<IEnumerable<Rental>> GetHistoryByUserIdAsync(int userId)
        {
            return await _context.Rentals
                .Include(r => r.Bike)
                .ThenInclude(b => b.Station)
                .Where(r => r.UserId == userId && r.Status != "Active")
                .OrderByDescending(r => r.StartTime)
                .ToListAsync();
        }

        public async Task<Rental> CreateAsync(Rental rental)
        {
            _context.Rentals.Add(rental);
            await _context.SaveChangesAsync();
            
            // Load relationships
            await _context.Entry(rental).Reference(r => r.User).LoadAsync();
            await _context.Entry(rental).Reference(r => r.Bike).LoadAsync();
            await _context.Entry(rental.Bike).Reference(b => b.Station).LoadAsync();
            
            return rental;
        }

        public async Task<Rental> UpdateAsync(Rental rental)
        {
            _context.Rentals.Update(rental);
            await _context.SaveChangesAsync();
            
            // Reload with relationships
            return await GetByIdAsync(rental.Id) ?? rental;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var rental = await _context.Rentals.FindAsync(id);
            if (rental == null) return false;

            _context.Rentals.Remove(rental);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
