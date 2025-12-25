using BikeRent.Data;
using BikeRent.Models.Entities;
using BikeRent.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BikeRent.Repositories
{
    public class BikeRepository : IBikeRepository
    {
        private readonly AppDbContext _context;

        public BikeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Bike?> GetByIdAsync(int id)
        {
            return await _context.Bikes
                .Include(b => b.Station)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<IEnumerable<Bike>> GetAllAsync()
        {
            return await _context.Bikes
                .Include(b => b.Station)
                .ToListAsync();
        }

        public async Task<IEnumerable<Bike>> GetAvailableAsync()
        {
            return await _context.Bikes
                .Include(b => b.Station)
                .Where(b => b.Status == "Available")
                .ToListAsync();
        }

        public async Task<IEnumerable<Bike>> GetByStationIdAsync(int stationId)
        {
            return await _context.Bikes
                .Include(b => b.Station)
                .Where(b => b.StationId == stationId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Bike>> GetByTypeAsync(string type)
        {
            return await _context.Bikes
                .Include(b => b.Station)
                .Where(b => b.Type.ToLower() == type.ToLower())
                .ToListAsync();
        }

        public async Task<IEnumerable<Bike>> GetByStationAndTypeAsync(int stationId, string type)
        {
            return await _context.Bikes
                .Include(b => b.Station)
                .Where(b => b.StationId == stationId && b.Type.ToLower() == type.ToLower())
                .ToListAsync();
        }

        public async Task<Bike> CreateAsync(Bike bike)
        {
            _context.Bikes.Add(bike);
            await _context.SaveChangesAsync();
            
            await _context.Entry(bike).Reference(b => b.Station).LoadAsync();
            return bike;
        }

        public async Task<Bike> UpdateAsync(Bike bike)
        {
            _context.Bikes.Update(bike);
            await _context.SaveChangesAsync();
            
            return await GetByIdAsync(bike.Id) ?? bike;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var bike = await _context.Bikes.FindAsync(id);
            if (bike == null) return false;

            _context.Bikes.Remove(bike);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Bikes.AnyAsync(b => b.Id == id);
        }
    }
}
