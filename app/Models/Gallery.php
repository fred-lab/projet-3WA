<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    /**
     * Optionnal : The table associated with the model
     */
    protected $table = "galleries";

    /**
     * Specify witch attributes are not mass assignable
     */
    protected $guarded = ['id', 'created_at', 'updated_at'];

    /**
     * Relationship One To One with Category
     */
    public function category(){
        return $this->hasOne('App\Models\Category');
    }
    
    /**
     * Relationship One To Many with Picture
     * gallery has many pictures
     */
    public  function pictures(){
        return $this->hasMany('App\Models\Picture');
    }
}
