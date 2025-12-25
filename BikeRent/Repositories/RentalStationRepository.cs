using BikeRent.Data;
using BikeRent.Models.Entities;
using BikeRent.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BikeRent.Repositories
{
    public class RentalStationRepository : IRentalStationRepository
    {
        private readonly AppDbContext _context;

        public RentalStationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<RentalStation?> GetByIdAsync(int id)
        {
            return await _context.RentalStations
                .Include(s => s.Bikes)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<RentalStation>> GetAllAsync()
        {
            return await _context.RentalStations
                .Include(s => s.Bikes)
                .ToListAsync();
        }

        public async Task<RentalStation> CreateAsync(RentalStation station)
        {
            _context.RentalStations.Add(station);
            await _context.SaveChangesAsync();
            return station;
        }

        public async Task<RentalStation> UpdateAsync(RentalStation station)
        {
            _context.RentalStations.Update(station);
            await _context.SaveChangesAsync();
            return station;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var station = await _context.RentalStations.FindAsync(id);
            if (station == null) return false;

            _context.RentalStations.Remove(station);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.RentalStations.AnyAsync(s => s.Id == id);
        }

        public async Task<int> GetAvailableBikesCountAsync(int stationId)
        {
            return await _context.Bikes
                .Where(b => b.StationId == stationId && b.Status == "Available")
                .CountAsync();
        }
    }
}
