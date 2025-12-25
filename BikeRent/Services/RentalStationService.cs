using BikeRent.Models.DTOs;
using BikeRent.Models.Entities;
using BikeRent.Repositories.Interfaces;
using BikeRent.Services.Interfaces;

namespace BikeRent.Services
{
    public class RentalStationService : IRentalStationService
    {
        private readonly IRentalStationRepository _stationRepository;

        public RentalStationService(IRentalStationRepository stationRepository)
        {
            _stationRepository = stationRepository;
        }

        public async Task<IEnumerable<RentalStationDto>> GetAllStationsAsync()
        {
            var stations = await _stationRepository.GetAllAsync();
            var stationDtos = new List<RentalStationDto>();

            foreach (var station in stations)
            {
                var availableCount = await _stationRepository.GetAvailableBikesCountAsync(station.Id);
                stationDtos.Add(MapToDto(station, availableCount));
            }

            return stationDtos;
        }

        public async Task<RentalStationDto?> GetStationByIdAsync(int id)
        {
            var station = await _stationRepository.GetByIdAsync(id);
            if (station == null) return null;

            var availableCount = await _stationRepository.GetAvailableBikesCountAsync(station.Id);
            return MapToDto(station, availableCount);
        }

        public async Task<RentalStationDto> CreateStationAsync(CreateRentalStationDto createStationDto)
        {
            var station = new RentalStation
            {
                Name = createStationDto.Name,
                Address = createStationDto.Address,
                Latitude = createStationDto.Latitude,
                Longitude = createStationDto.Longitude
            };

            var createdStation = await _stationRepository.CreateAsync(station);
            return MapToDto(createdStation, 0);
        }

        public async Task<RentalStationDto?> UpdateStationAsync(int id, UpdateRentalStationDto updateStationDto)
        {
            var station = await _stationRepository.GetByIdAsync(id);
            if (station == null) return null;

            if (!string.IsNullOrEmpty(updateStationDto.Name))
                station.Name = updateStationDto.Name;

            if (!string.IsNullOrEmpty(updateStationDto.Address))
                station.Address = updateStationDto.Address;

            if (updateStationDto.Latitude.HasValue)
                station.Latitude = updateStationDto.Latitude.Value;

            if (updateStationDto.Longitude.HasValue)
                station.Longitude = updateStationDto.Longitude.Value;

            var updatedStation = await _stationRepository.UpdateAsync(station);
            var availableCount = await _stationRepository.GetAvailableBikesCountAsync(updatedStation.Id);
            return MapToDto(updatedStation, availableCount);
        }

        public async Task<bool> DeleteStationAsync(int id)
        {
            return await _stationRepository.DeleteAsync(id);
        }

        private static RentalStationDto MapToDto(RentalStation station, int availableCount)
        {
            return new RentalStationDto
            {
                Id = station.Id,
                Name = station.Name,
                Address = station.Address,
                Latitude = station.Latitude,
                Longitude = station.Longitude,
                AvailableBikesCount = availableCount
            };
        }
    }
}
