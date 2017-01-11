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
}
