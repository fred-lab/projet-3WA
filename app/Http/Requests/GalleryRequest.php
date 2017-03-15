<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GalleryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // à revérifier quand la gestion utilisateur sera en place, par défaut false
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title'         => 'bail | required | unique:galleries,title| min:3 | max:75',
            'description'   => 'nullable | min:3 | max:1000',
            'date'          => 'nullable | date',
            'address'       => 'nullable | alpha_num | min:3 | max:75',
            'city'          => 'nullable | alpha | min:2 | max: 30',
            'zipCode'       => 'nullable | digits:5 | ',
            'longitude'     => 'nullable | regex:/^-?\d{1,3}\.\d{6,}$/',
            'latitude'      => 'nullable | regex:/^-?\d{1,2}\.\d{6,}$/',
            'price'         => 'nullable | digits_between: 1, 5',
            'public'        => 'boolean'
        ];
    }
}
