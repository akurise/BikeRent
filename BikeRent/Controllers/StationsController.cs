using BikeRent.Models.DTOs;
using BikeRent.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BikeRent.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StationsController : ControllerBase
    {
        private readonly IRentalStationService _stationService;

        public StationsController(IRentalStationService stationService)
        {
            _stationService = stationService;
        }

        /// <summary>
        /// Get all rental stations
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RentalStationDto>>> GetStations()
        {
            var stations = await _stationService.GetAllStationsAsync();
            return Ok(stations);
        }

        /// <summary>
        /// Get rental station by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<RentalStationDto>> GetStation(int id)
        {
            var station = await _stationService.GetStationByIdAsync(id);
            if (station == null)
            {
                return NotFound(new { message = "Station not found" });
            }
            return Ok(station);
        }

        /// <summary>
        /// Create a new rental station (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<RentalStationDto>> CreateStation([FromBody] CreateRentalStationDto createStationDto)
        {
            var station = await _stationService.CreateStationAsync(createStationDto);
            return CreatedAtAction(nameof(GetStation), new { id = station.Id }, station);
        }

        /// <summary>
        /// Update rental station (Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<RentalStationDto>> UpdateStation(int id, [FromBody] UpdateRentalStationDto updateStationDto)
        {
            var station = await _stationService.UpdateStationAsync(id, updateStationDto);
            if (station == null)
            {
                return NotFound(new { message = "Station not found" });
            }
            return Ok(station);
        }

        /// <summary>
        /// Delete rental station (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteStation(int id)
        {
            var result = await _stationService.DeleteStationAsync(id);
            if (!result)
            {
                return NotFound(new { message = "Station not found" });
            }
            return NoContent();
        }
    }
}
