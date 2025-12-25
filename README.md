# BikeRent

BikeRent is a simple bike rental system built with ASP.NET Core 8 and MySQL.
The project provides a REST API for managing bikes, rental stations, users, and rentals.
It follows a clean architecture approach and uses JWT authentication.

---

## Features

- User registration and login (JWT authentication)
- Role-based authorization (User / Admin)
- Bike management (CRUD for Admin)
- Rental station management (CRUD for Admin)
- Start and finish bike rentals
- Automatic rental cost calculation
- Rental history for users
- Bike statuses: Available / Rented / Service
- Swagger API documentation

---

## Tech Stack

- Backend: ASP.NET Core 8, C#
- Database: MySQL, Entity Framework Core
- Authentication: JWT + BCrypt
- Documentation: Swagger, Postman

---

## Requirements

- .NET SDK 8
- MySQL Server
- dotnet-ef tool
- (Optional) Postman

---

## Installation & Run

### 1. Clone repository

git clone https://github.com/your-username/BikeRent.git  
cd BikeRent

---

### 2. Configure database

Edit appsettings.json and set your MySQL connection string:

```
json
"ConnectionStrings": {
  "DefaultConnection": "server=localhost;database=bikerent;user=root;password=yourpassword"
}
```

### 3. Install EF Core tools (if not installed)

dotnet tool install --global dotnet-ef

### 4. Apply migrations

dotnet ef migrations add InitialCreate
dotnet ef database update

### 5. (Optional) Insert sample data

Run SampleData.sql in your MySQL database.

### 6. Run application

dotnet run

### API Documentation

After starting the project, open Swagger UI:

https://localhost:7018/swagger

### Example Requests
Register user

POST /api/auth/register

```
{
  "email": "user@mail.com",
  "password": "password123"
}
```

### Login

POST /api/auth/login

### Get available bikes

GET /api/bikes/available

### Start rental

POST /api/rentals/start
Authorization: Bearer <token>

```
{
  "bikeId": 1
}
```

### Finish rental

POST /api/rentals/finish
Authorization: Bearer <token>

```
{
  "rentalId": 1
}
```
