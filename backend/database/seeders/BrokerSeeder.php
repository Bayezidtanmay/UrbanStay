<?php

namespace Database\Seeders;

use App\Models\Broker;
use Illuminate\Database\Seeder;

class BrokerSeeder extends Seeder
{
    public function run(): void
    {
        Broker::query()->delete();

        $brokers = [
            [
                'name' => 'Anna Lehtinen',
                'area' => 'Helsinki',
                'specialty' => 'City apartments & short stays',
                'languages' => 'English, Finnish',
                'phone' => '+358 40 123 4567',
                'email' => 'anna@urbanstay.fi',
                'description' => 'Anna helps clients find modern apartments in central Helsinki.',
                'image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
            ],
            [
                'name' => 'Mikko Saarinen',
                'area' => 'Espoo',
                'specialty' => 'Family homes & monthly rentals',
                'languages' => 'English, Finnish, Swedish',
                'phone' => '+358 50 234 5678',
                'email' => 'mikko@urbanstay.fi',
                'description' => 'Mikko focuses on family-friendly apartments and long-term monthly rentals.',
                'image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
            ],
            [
                'name' => 'Sofia Niemi',
                'area' => 'Vantaa',
                'specialty' => 'Affordable rentals & student housing',
                'languages' => 'English, Finnish',
                'phone' => '+358 45 345 6789',
                'email' => 'sofia@urbanstay.fi',
                'description' => 'Sofia helps students and young professionals find affordable apartments.',
                'image' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
            ],
        ];

        foreach ($brokers as $broker) {
            Broker::create($broker);
        }
    }
}
