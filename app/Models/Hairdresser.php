<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hairdresser extends Model
{
    /**
     * Optionnal : The table associated with the model
     */
    protected $table = "hairdressers";

    /**
     * Specify witch attributes are not mass assignable
     */
    protected $guarded = ['id', 'created_at', 'updated_at'];

    /**
     * Relationship One To One with User
     */
    public function user(){
        return $this->hasOne('App\Models\User');
    }
}
