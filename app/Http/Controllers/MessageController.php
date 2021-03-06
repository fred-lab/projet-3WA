<?php

namespace App\Http\Controllers;

use App\Http\Requests\MessageRequest;
use App\Models\Banish;
use App\Models\Message;
use App\Services\AntiSpam;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Mail\Mailer;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    /**
     * MessageController constructor.
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => 'store']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if(Auth::user()->level > 1){
            return Message::latest()->get();
        }
        else{
            return response()->json(
                ['error' => ['Vous n\'avez pas les droits nécessaires']], 401
            );
        }
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\MessageRequest  $request
     * @param \Illuminate\Mail\Mailer $mail
     * @return \App\Models\Message
     */
    public function store(MessageRequest $request, Mailer $mail)
    {
        $antiSpam = AntiSpam::check();

        if ($antiSpam === true){
            $message = new Message();
            $message->name = $request['name'];
            $message->email = $request['email'];
            $message->title = $request['title'];
            $message->message = $request['message'];
            $message->ip = $request->ip();
            $message->save();

            $mail->send('mail.contact-confirmation',['receiver' => $request['name'], 'content' => $request['message']],
                function($message) use($request){
                    $message->to($request['email'])
                    ->from('no-reply@bokehlicious.fr')
                    ->subject('Confirmation de l\'envoi du message');
            });

            return $message;
        }
        else{
            return $antiSpam;
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Message  $message
     * @return \Illuminate\Http\Response
     */
    public function show(Message $message)
    {
        if(Auth::user()->level > 1){
            return Message::findOrFail($message);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Message  $message
     * @param  \Illuminate\Mail\Mailer $mail
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Message $message, Mailer $mail)
    {
        if(Auth::user()->level > 1){
            $message->update([
                'answered'    => true,
                'answer_date' => Carbon::now(),
                'answer'      => $request['reply']
            ]);

            if($message){
                $mail->send('mail.contact-reply',[
                    'title'    => $request['title'],
                    'receiver' => $request['receiver'],
                    'reply'    => $request['reply'],
                    'quote'    => $request['quote']
                ],
                    function($message) use($request){
                        $message->to($request['replyMail'])
                            ->from('contact@bokehlicious.fr')
                            ->subject($request['title']);
                    });
                return 'La réponse a bien été envoyé';
            }
            else{
                return 'Une erreur est survenue lors de la sauvegarde, le message n\'a pas été envoyé';
            }
        }
        else{
            return response()->json(
                ['error' => ['Vous n\'avez pas les droits nécessaires']], 401
            );
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Message  $message
     * @return string
     */
    public function destroy(Message $message)
    {
        if(Auth::user()->level > 1){
            $message->delete();

            return 'Message supprimé';
        }
        else{
            return response()->json(
                ['error' => ['Vous n\'avez pas les droits nécessaires']], 401
            );
        }

    }

    /**
     * Create an IP
     * @param string $ip
     * @return void
     */
    public function createIp(string $ip)
    {
        if(!Banish::where('ip', '=', $ip)->exists()){
            Banish::create([
                'ip' => $ip
            ]);
        }
    }

    /**
     * Delete a list of message
     * @param string $ip
     * @return void
     */
    public function deleteMessage(string $ip)
    {
        $ipList = Message::where('ip', '=', $ip)->get();

        if(count($ipList) > 0){
            foreach ($ipList as $message){
                $message->delete();
            }
        }
    }

    /**
     * Ban an Ip
     *
     * @param \Illuminate\Http\Request  $request
     * @return string
     */
    public function ban(Request $request)
    {
        if(Auth::user()->level > 1){
            $this->createIp($request['ip']);

            $this->deleteMessage($request['ip']);

            return 'Cette Ip a été banni';
        }
        else{
            return response()->json(
                ['error' => ['Vous n\'avez pas les droits nécessaires']], 401
            );
        }

    }

    /**
     * Mass deleting
     *
     * @param \Illuminate\Http\Request  $request
     * @return string
     */
    public function massDelete(Request $request)
    {
        if(Auth::user()->level > 1){
            if(count($request->all()) > 0){
                foreach ($request->all() as $message){
                    Message::findOrFail($message['id'])->delete();
                }
            }
            return "Les messages ont bien été supprimés";
        }
        else{
            return response()->json(
                ['error' => ['Vous n\'avez pas les droits nécessaires']], 401
            );
        }
    }
    /**
     * Mass banning
     *
     * @param \Illuminate\Http\Request  $request
     * @return string
     */
    public function massBan(Request $request)
    {
        if(Auth::user()->level > 1){
            if(count($request->all()) > 0){
                foreach ($request->all() as $message){
                    $this->createIp($message['ip']);
                    $this->deleteMessage($message['ip']);
                }
            }
            return "Les IP des messages ont bien été bannis";
        }
        else{
            return response()->json(
                ['error' => ['Vous n\'avez pas les droits nécessaires']], 401
            );
        }
    }
}
