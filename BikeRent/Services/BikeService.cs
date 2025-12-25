using BikeRent.Models.DTOs;
using BikeRent.Models.Entities;
using BikeRent.Repositories.Interfaces;
using BikeRent.Services.Interfaces;

namespace BikeRent.Services
{
    public class BikeService : IBikeService
    {
        private readonly IBikeRepository _bikeRepository;
        private readonly IRentalStationRepository _stationRepository;

        public BikeService(IBikeRepository bikeRepository, IRentalStationRepository stationRepository)
        {
            _bikeRepository = bikeRepository;
            _stationRepository = stationRepository;
        }

        public async Task<IEnumerable<BikeDto>> GetAllBikesAsync()
        {
            var bikes = await _bikeRepository.GetAllAsync();
            return bikes.Select(MapToDto);
        }

        public async Task<BikeDto?> GetBikeByIdAsync(int id)
        {
            var bike = await _bikeRepository.GetByIdAsync(id);
            return bike != null ? MapToDto(bike) : null;
        }

        public async Task<IEnumerable<BikeDto>> GetAvailableBikesAsync()
        {
            var bikes = await _bikeRepository.GetAvailableAsync();
            return bikes.Select(MapToDto);
        }

        public async Task<IEnumerable<BikeDto>> GetBikesByFiltersAsync(int? stationId, string? type)
        {
            IEnumerable<Bike> bikes;

            if (stationId.HasValue && !string.IsNullOrEmpty(type))
            {
                bikes = await _bikeRepository.GetByStationAndTypeAsync(stationId.Value, type);
            }
            else if (stationId.HasValue)
            {
                bikes = await _bikeRepository.GetByStationIdAsync(stationId.Value);
            }
            else if (!string.IsNullOrEmpty(type))
            {
                bikes = await _bikeRepository.GetByTypeAsync(type);
            }
            else
            {
                bikes = await _bikeRepository.GetAllAsync();
            }

            return bikes.Select(MapToDto);
        }

        public async Task<BikeDto> CreateBikeAsync(CreateBikeDto createBikeDto)
        {
            if (!await _stationRepository.ExistsAsync(createBikeDto.StationId))
            {
                throw new InvalidOperationException("Station not found");
            }

            var bike = new Bike
            {
                Model = createBikeDto.Model,
                Type = createBikeDto.Type,
                PricePerHour = createBikeDto.PricePerHour,
                StationId = createBikeDto.StationId,
                Status = "Available"
            };

            var createdBike = await _bikeRepository.CreateAsync(bike);
            return MapToDto(createdBike);
        }

        public async Task<BikeDto?> UpdateBikeAsync(int id, UpdateBikeDto updateBikeDto)
        {
            var bike = await _bikeRepository.GetByIdAsync(id);
            if (bike == null) return null;

            if (!string.IsNullOrEmpty(updateBikeDto.Model))
                bike.Model = updateBikeDto.Model;

            if (!string.IsNullOrEmpty(updateBikeDto.Type))
                bike.Type = updateBikeDto.Type;

            if (updateBikeDto.PricePerHour.HasValue)
                bike.PricePerHour = updateBikeDto.PricePerHour.Value;

            if (!string.IsNullOrEmpty(updateBikeDto.Status))
                bike.Status = updateBikeDto.Status;

            if (updateBikeDto.StationId.HasValue)
            {
                if (!await _stationRepository.ExistsAsync(updateBikeDto.StationId.Value))
                {
                    throw new InvalidOperationException("Station not found");
                }
                bike.StationId = updateBikeDto.StationId.Value;
            }

            var updatedBike = await _bikeRepository.UpdateAsync(bike);
            return MapToDto(updatedBike);
        }

        public async Task<bool> DeleteBikeAsync(int id)
        {
            return await _bikeRepository.DeleteAsync(id);
        }

        private static BikeDto MapToDto(Bike bike)
        {
            return new BikeDto
            {
                Id = bike.Id,
                Model = bike.Model,
                Type = bike.Type,
                PricePerHour = bike.PricePerHour,
                Status = bike.Status,
                StationId = bike.StationId,
                StationName = bike.Station?.Name ?? string.Empty
            };
        }
    }
}
