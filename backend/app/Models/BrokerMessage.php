<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BrokerMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'broker_id',
        'user_id',
        'name',
        'email',
        'message',
    ];

    public function broker()
    {
        return $this->belongsTo(Broker::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
