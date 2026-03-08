<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Apartment extends Model
{
    use HasFactory;

    protected $fillable = [
        'created_by',
        'title',
        'slug',
        'description',
        'location',
        'address',
        'price_per_night',
        'price_per_month',
        'rental_type',
        'bedrooms',
        'bathrooms',
        'size',
        'is_available',
        'featured_image',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function images()
    {
        return $this->hasMany(ApartmentImage::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function unavailableDates()
    {
        return $this->hasMany(UnavailableDate::class);
    }
}
