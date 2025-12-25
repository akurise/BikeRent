using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BikeRent.Models.Entities
{
    public class Bike
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Model { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = string.Empty; // City, Mountain, Electric

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal PricePerHour { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Available"; // Available, Rented, Service

        [Required]
        public int StationId { get; set; }

        [ForeignKey("StationId")]
        public RentalStation Station { get; set; } = null!;
        
        public ICollection<Rental> Rentals { get; set; } = new List<Rental>();
    }
}
