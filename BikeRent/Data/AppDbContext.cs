using BikeRent.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace BikeRent.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<RentalStation> RentalStations { get; set; }
        public DbSet<Bike> Bikes { get; set; }
        public DbSet<Rental> Rentals { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure RentalStation entity
            modelBuilder.Entity<RentalStation>(entity =>
            {
                entity.HasMany(s => s.Bikes)
                    .WithOne(b => b.Station)
                    .HasForeignKey(b => b.StationId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Bike entity
            modelBuilder.Entity<Bike>(entity =>
            {
                entity.Property(e => e.PricePerHour).HasPrecision(10, 2);
                entity.HasIndex(e => e.StationId);
            });

            // Configure Rental entity
            modelBuilder.Entity<Rental>(entity =>
            {
                entity.Property(e => e.TotalPrice).HasPrecision(10, 2);
                entity.Property(e => e.StartTime).HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                entity.HasOne(r => r.User)
                    .WithMany(u => u.Rentals)
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(r => r.Bike)
                    .WithMany(b => b.Rentals)
                    .HasForeignKey(r => r.BikeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.BikeId);
                entity.HasIndex(e => e.Status);
            });
        }
    }
}
