using BikeRent.Models.DTOs;
using BikeRent.Models.Entities;
using BikeRent.Repositories.Interfaces;
using BikeRent.Services.Interfaces;

namespace BikeRent.Services
{
    public class RentalService : IRentalService
    {
        private readonly IRentalRepository _rentalRepository;
        private readonly IBikeRepository _bikeRepository;
        private readonly IUserRepository _userRepository;

        public RentalService(
            IRentalRepository rentalRepository,
            IBikeRepository bikeRepository,
            IUserRepository userRepository)
        {
            _rentalRepository = rentalRepository;
            _bikeRepository = bikeRepository;
            _userRepository = userRepository;
        }

        public async Task<RentalDto> StartRentalAsync(int userId, StartRentalDto startRentalDto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            var activeRental = await _rentalRepository.GetActiveRentalByUserIdAsync(userId);
            if (activeRental != null)
            {
                throw new InvalidOperationException("You already have an active rental");
            }

            var bike = await _bikeRepository.GetByIdAsync(startRentalDto.BikeId);
            if (bike == null)
            {
                throw new InvalidOperationException("Bike not found");
            }

            if (bike.Status != "Available")
            {
                throw new InvalidOperationException("Bike is not available");
            }

            var rental = new Rental
            {
                UserId = userId,
                BikeId = startRentalDto.BikeId,
                StartTime = DateTime.UtcNow,
                Status = "Active"
            };

            var createdRental = await _rentalRepository.CreateAsync(rental);

            bike.Status = "Rented";
            await _bikeRepository.UpdateAsync(bike);

            return MapToDto(createdRental);
        }

        public async Task<RentalDto> FinishRentalAsync(int userId, FinishRentalDto finishRentalDto)
        {
            var rental = await _rentalRepository.GetByIdAsync(finishRentalDto.RentalId);
            if (rental == null)
            {
                throw new InvalidOperationException("Rental not found");
            }

            if (rental.UserId != userId)
            {
                throw new UnauthorizedAccessException("This rental does not belong to you");
            }

            if (rental.Status != "Active")
            {
                throw new InvalidOperationException("Rental is not active");
            }

            rental.EndTime = DateTime.UtcNow;
            var duration = (rental.EndTime.Value - rental.StartTime).TotalHours;
            rental.TotalPrice = (decimal)Math.Ceiling(duration) * rental.Bike.PricePerHour;
            rental.Status = "Finished";

            var updatedRental = await _rentalRepository.UpdateAsync(rental);

            var bike = await _bikeRepository.GetByIdAsync(rental.BikeId);
            if (bike != null)
            {
                bike.Status = "Available";
                await _bikeRepository.UpdateAsync(bike);
            }

            return MapToDto(updatedRental);
        }

        public async Task<RentalDto?> GetActiveRentalAsync(int userId)
        {
            var rental = await _rentalRepository.GetActiveRentalByUserIdAsync(userId);
            return rental != null ? MapToDto(rental) : null;
        }

        public async Task<IEnumerable<RentalDto>> GetRentalHistoryAsync(int userId)
        {
            var rentals = await _rentalRepository.GetHistoryByUserIdAsync(userId);
            return rentals.Select(MapToDto);
        }

        public async Task<IEnumerable<RentalDto>> GetAllRentalsAsync()
        {
            var rentals = await _rentalRepository.GetAllAsync();
            return rentals.Select(MapToDto);
        }

        private static RentalDto MapToDto(Rental rental)
        {
            decimal? durationHours = null;
            if (rental.EndTime.HasValue)
            {
                durationHours = (decimal)(rental.EndTime.Value - rental.StartTime).TotalHours;
            }

            return new RentalDto
            {
                Id = rental.Id,
                UserId = rental.UserId,
                UserEmail = rental.User?.Email ?? string.Empty,
                BikeId = rental.BikeId,
                BikeModel = rental.Bike?.Model ?? string.Empty,
                BikeType = rental.Bike?.Type ?? string.Empty,
                StartTime = rental.StartTime,
                EndTime = rental.EndTime,
                TotalPrice = rental.TotalPrice,
                Status = rental.Status,
                DurationHours = durationHours
            };
        }
    }
}
