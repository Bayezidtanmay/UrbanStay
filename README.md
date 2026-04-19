# 🏙️ UrbanStay – Full Stack Apartment Rental Platform

UrbanStay is a modern full-stack web application for discovering, booking, and managing rental apartments.  
It provides a seamless experience for users, property owners, and administrators with powerful filtering, real-time features, and a clean UI.

---

## 🚀 Features

### 🔍 Apartment Discovery
- Advanced filtering (location, price, bedrooms, availability)
- Sorting (price, newest, bedrooms, etc.)
- Map-based apartment exploration (OpenStreetMap)
- Responsive grid layout with modern UI

### ❤️ Favorites System
- Add/remove apartments to favorites
- Live badge counter in navbar
- Persistent user-based favorites

### 🏠 Apartment Details
- Image gallery slider
- Booking system (nightly & monthly)
- Reviews and ratings
- Location map with coordinates
- Recommended brokers

### 📅 Booking System
- Nightly & monthly booking support
- Smart date validation:
  - Monthly bookings must start on **1st day**
  - End on **last day of month**
- Prevents overlapping bookings
- Automatic price calculation

### 🔔 Notification System
- Real-time notification dropdown
- Booking updates & alerts
- Unread notification badge

### 🧑‍💼 Admin Panel
- Create, update, delete apartments
- Upload featured & gallery images
- Manage pricing and availability

### 📝 Blog Section
- Homepage blog previews
- Dynamic blog detail pages

---

## 📸 Screenshots

> 📁 Screenshots are located in the `/Screenshots` folder

### 🏠 Home Page
![Home](./Screenshots/Home_page_1.png)
![Home](./Screenshots/Home_page_2.png)
![Home](./Screenshots/Home_page_3.png)

### 🔍 Apartments Listing
![Apartments](./Screenshots/Apartments_page_1.png)
![Apartments](./Screenshots/Apartments_page_2.png)

### 🏡 Apartment Details
![Details](./Screenshots/Apartment_Details_1.png)
![Details](./Screenshots/Apartment_Details_2.png)
![Details](./Screenshots/Apartment_Details_3.png)
![Details](./Screenshots/Apartment_Details_4.png)

### 🏡 Map view
![Map](./Screenshots/Map_view_page_1.png)
![Map](./Screenshots/Map_view_page_2.png)

### ❤️ Favorites
![Favorites](./Screenshots/Favorites_page.png)

### Find a Broker
![Broker](./Screenshots/Find_broker_page.png)

### 🧑‍💼 User Dashboard
![User Dashboard](./Screenshots/User_Dashboard.png)

### 🧑‍💼 User Profile
![Booking](./Screenshots/Profile_page_1.png)
![Booking](./Screenshots/Profile_page_2.png)

### 📅 Booking System
![Booking](./Screenshots/User_Booking.png)

### 📅 Checkout System
![Checkout](./Screenshots/Checkout_page.png)

### 🧑‍💼 Admin Panel
![Admin](./Screenshots/Admin_Dashboard_1.png)
![Admin](./Screenshots/Admin_Dashboard_2.png)

### 🔔 Notifications
![Notifications](./Screenshots/Notification.png)



---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- React Router
- Context API (Auth, Favorites)
- Custom CSS
- rc-slider
- react-datepicker

### Backend
- Laravel (REST API)
- Laravel Sanctum (Authentication)
- MySQL / MariaDB

### Tools & Services
- OpenStreetMap (Nominatim API)
- Docker (Database)
- Git & GitHub

---

## 📁 Project Structure

urbanstay/
│
├── backend/        # Laravel API
│   ├── app/
│   ├── routes/
│   └── database/
│
├── frontend/       # React (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── router/
│
├── Screenshots/    # App screenshots
│
└── README.md

---

## ⚙️ Installation

### 🔹 Backend (Laravel)

cd backend  
composer install  
cp .env.example .env  
php artisan key:generate  

# Configure database in .env

php artisan migrate  
php artisan storage:link  
php artisan serve  

---

### 🔹 Frontend (React)

cd frontend  
npm install  
npm run dev  

Frontend: http://localhost:5173  
Backend: http://127.0.0.1:8000  

---

## 🔐 Authentication

- Laravel Sanctum (token-based)
- Protected routes:
  - Dashboard
  - Favorites
  - Booking
  - Admin panel

---

## 📸 Image Support

Supports modern image formats:

- AVIF (recommended)
- WebP
- JPG / PNG

---

## 💡 Key Highlights

- Full-stack architecture (React + Laravel)
- Real-world booking logic
- Advanced filtering & sorting
- Clean and modern UI/UX
- RESTful API design
- Optimized image handling (AVIF support)

---

## 🎯 Future Improvements

- Payment integration (Stripe)
- Real-time chat system
- AI-powered recommendations
- Mobile app version
- Email notifications

---

## 👨‍💻 Author

Bayezid Rahman Tanmay  
Full Stack Web Developer  
📍 Finland  

---

## ⭐ Final Note

This project demonstrates real-world development skills including:

- API design
- Authentication & state management
- Complex business logic (booking system)
- UI/UX development
- Performance optimization

If you like this project, feel free to ⭐ the repository!