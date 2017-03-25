<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MessageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; //à modifier en fonction des règles de sécurité
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name'    => 'bail | required | min:3 | max:50',
            'email'   => 'bail | required | email',
            'title' => 'required | min:3 | max: 50',
            'message' => 'bail | required |min:3 | max:1000 ',
            'user_ip'      => 'ip'
        ];
    }
}
