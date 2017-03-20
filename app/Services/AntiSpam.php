<?php
/**
 * Created by IntelliJ IDEA.
 * User: fred
 * Date: 16/03/17
 * Time: 17:56
 */

namespace App\Services;


use App\Models\Banish;
use App\Models\Message;
use Carbon\Carbon;

class AntiSpam
{    
    /**
     * Check if the message is a spam
     */
    public static function check()
    {
        if (self::origin() === false){
            return response()->json(
                ['spam' => ['you can\'t always get what you want !!']], 403
            );
        }
        if (self::ipBan() === true){
            return response()->json(
                ['spam' => ['Malheureusement, votre IP a été banni de ce site']], 403
            );
        }
        if (self::lastTime() === false){
            return response()->json(
                ['spam' => ['Veuillez attendre avant de poster un nouveau message']], 403
            );
        }
        if(self::unansweredMessage() === false){
            return response()->json(
                ['spam' => ['Vous avez trop de message sans réponse. Veuillez attendre une réponse avant de poster un nouveau message']], 403
            );
        }
        return true;
    }

    /**
     * Check the HTTP_ORIGIN to match with the root URl of the site
     * @return boolean
     */
    public static function origin()
    {
        return (request()->server("HTTP_ORIGIN") == request()->root()) ? true : false;
    }

    /**
     * Check if the Ip has been banished
     * @return boolean
     */
    public static function ipBan()
    {
        return Banish::where('ip', request()->ip())->exists();
    }

    /**
     * Check the last time this ip send a message
     * @return boolean
     */
    public static function lastTime()
    {
        $lastMessage = Message::where('ip', request()->ip())
            ->orderBy('created_at', 'desc')->first();

        if(isset($lastMessage)){
            $lastMessage = $lastMessage->created_at
                ->diffInMinutes(null, true);
            
            return ($lastMessage > 60) ? true : false;
        }
        else{
            return true;
        }


    }

    /**
     * Check the number of message with no answer for this ip
     * @return boolean
     */
    public static function unansweredMessage()
    {
        $countMessages = Message::where([
            ['ip', request()->ip()],
            ['answered', '=', 0]
        ])->count();

        return ($countMessages < 5) ? true : false;
    }
}