<?php

namespace App\Services;

use App\Models\AppNotification;
use App\Models\User;

class NotificationService
{
    public static function send(
        int $userId,
        string $type,
        string $title,
        string $message,
        ?string $link = null,
        array $meta = []
    ): AppNotification {
        return AppNotification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'link' => $link,
            'meta' => $meta,
            'is_read' => false,
        ]);
    }

    public static function sendToAdmins(
        string $type,
        string $title,
        string $message,
        ?string $link = null,
        array $meta = []
    ): void {
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            self::send($admin->id, $type, $title, $message, $link, $meta);
        }
    }
}
