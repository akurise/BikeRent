using BikeRent.Models.DTOs;
using BikeRent.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BikeRent.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RentalsController : ControllerBase
    {
        private readonly IRentalService _rentalService;

        public RentalsController(IRentalService rentalService)
        {
            _rentalService = rentalService;
        }

        /// <summary>
        /// Start a new rental
        /// </summary>
        [HttpPost("start")]
        public async Task<ActionResult<RentalDto>> StartRental([FromBody] StartRentalDto startRentalDto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            try
            {
                var rental = await _rentalService.StartRentalAsync(userId.Value, startRentalDto);
                return Ok(rental);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Finish an active rental
        /// </summary>
        [HttpPost("finish")]
        public async Task<ActionResult<RentalDto>> FinishRental([FromBody] FinishRentalDto finishRentalDto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            try
            {
                var rental = await _rentalService.FinishRentalAsync(userId.Value, finishRentalDto);
                return Ok(rental);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        /// <summary>
        /// Get current active rental
        /// </summary>
        [HttpGet("active")]
        public async Task<ActionResult<RentalDto>> GetActiveRental()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var rental = await _rentalService.GetActiveRentalAsync(userId.Value);
            if (rental == null)
            {
                return NotFound(new { message = "No active rental found" });
            }

            return Ok(rental);
        }

        /// <summary>
        /// Get rental history for current user
        /// </summary>
        [HttpGet("history")]
        public async Task<ActionResult<IEnumerable<RentalDto>>> GetRentalHistory()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var rentals = await _rentalService.GetRentalHistoryAsync(userId.Value);
            return Ok(rentals);
        }

        /// <summary>
        /// Get all rentals (Admin only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<RentalDto>>> GetAllRentals()
        {
            var rentals = await _rentalService.GetAllRentalsAsync();
            return Ok(rentals);
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            {
                return null;
            }
            return userId;
        }
    }
}
