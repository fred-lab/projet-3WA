<?php

namespace App\Models;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * the "boot" function
     *
     * @return void
     */
    public static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            $user->slug = self::uniqueSlug($user);
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * Relationship Many To Many with Picture
     */
    public function pictures(){
        return $this->belongsToMany('App\Models\Picture');
    }

    /**
     * Give a unique slug to the user
     * @param \App\Models\User $user
     * @return string
     */
    public static function uniqueSlug(User $user)
    {
        $name = str_slug($user->name);
        $lastName = str_slug($user->last_name);
        $slugName = $name.'-'.$lastName;

        $count = User::where('slug', 'LIKE', $slugName.'%')->count();
        
        if( $count > 0){
            $slugName = $slugName.'-'.$count;
        }
        return $slugName;
    }
}
