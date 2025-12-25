using System.ComponentModel.DataAnnotations;

namespace BikeRent.Models.Entities
{
    public class RentalStation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Address { get; set; } = string.Empty;

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        // Navigation property
        public ICollection<Bike> Bikes { get; set; } = new List<Bike>();
    }
}
