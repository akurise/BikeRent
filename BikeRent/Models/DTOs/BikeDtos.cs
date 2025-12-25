using System.ComponentModel.DataAnnotations;

namespace BikeRent.Models.DTOs
{
    public class BikeDto
    {
        public int Id { get; set; }
        public string Model { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal PricePerHour { get; set; }
        public string Status { get; set; } = string.Empty;
        public int StationId { get; set; }
        public string StationName { get; set; } = string.Empty;
    }

    public class CreateBikeDto
    {
        [Required]
        [MaxLength(255)]
        public string Model { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = string.Empty; // City, Mountain, Electric

        [Required]
        [Range(0.01, 10000)]
        public decimal PricePerHour { get; set; }

        [Required]
        public int StationId { get; set; }
    }

    public class UpdateBikeDto
    {
        [MaxLength(255)]
        public string? Model { get; set; }

        [MaxLength(50)]
        public string? Type { get; set; }

        [Range(0.01, 10000)]
        public decimal? PricePerHour { get; set; }

        [MaxLength(50)]
        public string? Status { get; set; }

        public int? StationId { get; set; }
    }
}
