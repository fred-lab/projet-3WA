<?php
/**
 * Created by IntelliJ IDEA.
 * User: fred
 * Date: 16/02/17
 * Time: 15:13
 */

namespace App\Services;

use Intervention\Image\ImageManagerStatic as Image;


class PicturesManager
{
    /**
     * Create a picture
     */
    public static function setLargePicture ($picture)
    {
//        dd(Image::configure());
        return Image::make($picture)
            ->resize(null, 900, function ($constraint){
                $constraint->aspectRatio();
                $constraint->upsize();
            })
            ->save();
    }
}