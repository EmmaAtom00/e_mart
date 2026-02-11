# E-Mart Backend

This is the Django-based backend for the E-Mart e-commerce platform. It provides a RESTful API for products, authentication, cart management, and more.

## Quick Start

1. **Navigate to backend directory**: `cd backend`
2. **Install dependencies**: `pip install -r requirements.txt`
3. **Run migrations**: `python manage.py migrate`
4. **Start the server**: `python manage.py runserver`

## Features

- **JWT Authentication**: Secure user management with HTTP-only cookies.
- **Product Management**: Advanced filtering, sorting, and pagination.
- **RESTful API**: Comprehensive API endpoints documented with Swagger.
- **Media Handling**: Support for high-quality product imagery.

## Documentation

Detailed documentation can be found in the [docs/](docs/) directory.
- [API Overview](docs/BACKEND_DOCUMENTATION.md)
- [Database Schema](schema.yml)
