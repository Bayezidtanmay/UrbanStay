<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UnavailableDate extends Model
{
    use HasFactory;

    protected $fillable = [
        'apartment_id',
        'date',
    ];

    public function apartment()
    {
        return $this->belongsTo(Apartment::class);
    }
}
