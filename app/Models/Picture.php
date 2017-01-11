<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Picture extends Model
{
    /**
     * Optionnal : The table associated with the model
     */
    protected $table = "pictures";

    /**
     * Specify witch attributes are not mass assignable
     */
    protected $guarded = ['id', 'path', 'created_at', 'updated_at'];

    /**
     * Relationship Many To One with Gallery
     * pictures belongs to gallery
     */
    public function gallery(){
        return $this->belongsTo('App\Models\Gallery');
    }

    /**
     * Relationship Many To Many with User
     */
    public function users(){
        return $this->belongsToMany('App\Models\User');
    }
}
