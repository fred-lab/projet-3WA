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
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title'         => 'required | unique:gallery,title | min:3 | max:75',
            'description'   => ' min:3 | max:1000',
            'pictures'      => 'image | mimes:jpeg | max: 15000',
            'date'          => 'date',
            'address'       => 'alpha_num | min:3 | max:75',
            'city'          => 'alpha | min:2 | max: 30',
            'zipCode'       => 'digits:5 | ',
            'longitude'     => 'regex:/^-?\d{1,3}\.\d{6,}$/',
            'latitude'      => 'regex:/^-?\d{1,2}\.\d{6,}$/',
            'price'         => 'digits_between: 1, 5'
        ];
    }
}
