<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Gallery;
use Illuminate\Auth\Access\HandlesAuthorization;

class GalleryPolicy
{
    use HandlesAuthorization;


    /**
     * Determine the minimum access level for a user
     * to access to this action
     *
     * @param \App\Models\User $user
     * @param int $level
     * @return boolean
     */
    private function isGrantedTo(User $user, int $level)
    {
        return ($user->level >= $level) ? true : false;
    }

    /**
     * Give all rights to the super user (lvl3 )
     *
     * @param \App\Models\User $user
     * @return boolean
     */
    public function before(User $user)
    {
        return $this->isGrantedTo($user, 3);
    }

    /**
     * Determine whether the user can view the gallery.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Gallery  $gallery
     * @return mixed
     */
    public function view(User $user, Gallery $gallery)
    {
        return $this->isGrantedTo($user, 2);
    }

    /**
     * Determine whether the user can store galleries.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Gallery  $gallery
     * @return mixed
     */
    public function store(User $user, Gallery $gallery)
    {
        return $this->isGrantedTo($user, 2);
    }

    /**
     * Determine whether the user can update the gallery.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Gallery  $gallery
     * @return mixed
     */
    public function update(User $user, Gallery $gallery)
    {
        return $this->isGrantedTo($user, 2);
    }

    /**
     * Determine whether the user can delete the gallery.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Gallery  $gallery
     * @return mixed
     */
    public function delete(User $user, Gallery $gallery)
    {
        return $this->isGrantedTo($user, 2);
    }
}
