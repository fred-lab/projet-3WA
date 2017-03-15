<?php

namespace App\Models;

use App\Services\FilesManager;
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
     * the old Slug
     */
    protected $oldSlug;

    /**
     * the "boot" function
     *
     * @return void
     */
    public static function boot()
    {
        parent::boot();

        static::creating(function($gallery)
        {
            $gallery->slug = str_slug($gallery->title);
        });

        static::saved(function ($gallery)
        {
            FilesManager::upload(request()->pictures, $gallery);
            FilesManager::isPreview($gallery);
            Gallery::picturesCount($gallery);
        });

        static::updating(function ($gallery){
            $oldSlug = $gallery->slug;
            $gallery->slug = str_slug($gallery->title);
            FilesManager::updateGallery($gallery, $oldSlug);
        });

        static::deleted(function ($gallery)
        {
            FilesManager::destroyGallery($gallery);
        });
    }


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

    /**
     * Update the gallery with the count of pictures in the gallery
     */
    public static function picturesCount($gallery){
        $count = $gallery->pictures()->count();
        
        if($gallery->total_pictures != $count)
            return $gallery->update([
            'total_pictures' => $count
        ]);
    }
}
