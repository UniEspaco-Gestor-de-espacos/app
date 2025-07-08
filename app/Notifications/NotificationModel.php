<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotificationModel extends Notification
{
    use Queueable;
    public $titulo; // A solicitação de reserva
    public $descricao; // Descrição da solicitação
    public $url;

    public function __construct($titulo, $descricao, $url)
    {
        $this->titulo = $titulo; // Título da notificação
        $this->descricao = $descricao; // Descrição da notificação
        $this->url = $url; // A solicitação de reserva
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line($this->titulo)
            ->action('Notification Action', $this->url)
            ->line($this->descricao);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'titulo' => $this->titulo,
            'descricao' => $this->descricao,
            'url' => $this->url,
        ];
    }
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'titulo' => $this->titulo,
            'descricao' => $this->descricao,
            'url' => $this->url,
        ]);
    }
}
