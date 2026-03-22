<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Broker extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'area',
        'service_areas',
        'specialty',
        'languages',
        'phone',
        'email',
        'description',
        'image',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'service_areas' => 'array',
    ];

    public function messages()
    {
        return $this->hasMany(BrokerMessage::class);
    }
}
