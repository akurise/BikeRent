using System.ComponentModel.DataAnnotations;

namespace BikeRent.Models.DTOs
{
    public class RentalDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public int BikeId { get; set; }
        public string BikeModel { get; set; } = string.Empty;
        public string BikeType { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public decimal? TotalPrice { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal? DurationHours { get; set; }
    }

    public class StartRentalDto
    {
        [Required]
        public int BikeId { get; set; }
    }

    public class FinishRentalDto
    {
        [Required]
        public int RentalId { get; set; }
    }
}
