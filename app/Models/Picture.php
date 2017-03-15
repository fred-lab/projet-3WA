<?php

namespace App\Models;

use App\Services\FilesManager;
use Intervention\Image\ImageManagerStatic as Image;
use App\Services\PicturesManager;
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
    protected $guarded = ['id', 'created_at', 'updated_at'];

    /**
     * the "boot" function
     * @return void
     */
    public static function boot()
    {
        parent::boot();

        static::deleted(function ($picture)
        {
            FilesManager::destroyPicture(public_path().$picture->path. '/' .$picture->title);
            if($picture->has_focus == 1){
                FilesManager::destroyPicture(public_path().$picture->path. '/' .$picture->thumb_name);
            }
        });
    }

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
