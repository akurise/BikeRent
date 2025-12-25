using BikeRent.Models.DTOs;
using BikeRent.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BikeRent.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BikesController : ControllerBase
    {
        private readonly IBikeService _bikeService;

        public BikesController(IBikeService bikeService)
        {
            _bikeService = bikeService;
        }

        /// <summary>
        /// Get all bikes with optional filters
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BikeDto>>> GetBikes([FromQuery] int? stationId, [FromQuery] string? type)
        {
            var bikes = await _bikeService.GetBikesByFiltersAsync(stationId, type);
            return Ok(bikes);
        }

        /// <summary>
        /// Get available bikes only
        /// </summary>
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<BikeDto>>> GetAvailableBikes()
        {
            var bikes = await _bikeService.GetAvailableBikesAsync();
            return Ok(bikes);
        }

        /// <summary>
        /// Get bike by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<BikeDto>> GetBike(int id)
        {
            var bike = await _bikeService.GetBikeByIdAsync(id);
            if (bike == null)
            {
                return NotFound(new { message = "Bike not found" });
            }
            return Ok(bike);
        }

        /// <summary>
        /// Create a new bike (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<BikeDto>> CreateBike([FromBody] CreateBikeDto createBikeDto)
        {
            try
            {
                var bike = await _bikeService.CreateBikeAsync(createBikeDto);
                return CreatedAtAction(nameof(GetBike), new { id = bike.Id }, bike);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Update bike (Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<BikeDto>> UpdateBike(int id, [FromBody] UpdateBikeDto updateBikeDto)
        {
            try
            {
                var bike = await _bikeService.UpdateBikeAsync(id, updateBikeDto);
                if (bike == null)
                {
                    return NotFound(new { message = "Bike not found" });
                }
                return Ok(bike);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Delete bike (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteBike(int id)
        {
            var result = await _bikeService.DeleteBikeAsync(id);
            if (!result)
            {
                return NotFound(new { message = "Bike not found" });
            }
            return NoContent();
        }
    }
}
