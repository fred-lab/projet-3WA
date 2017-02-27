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
     * Define the format of the pictures
     * width, height
     * @var array
     */
    protected static $formats = [
        'thumbs'    => [768, null],
        'large'     => [null, 900]
    ];

    /**
     * Create a thumbs picture
     * @param $picture
     * @return \Intervention\Image\Image
     */
    public static function setThumbsPicture (string $picture, $filename = null)
    {
        self::setPicture($picture, self::$formats['thumbs'], $filename);
    }

    /**
     * Create a large picture
     * @param $picture
     * @return \Intervention\Image\Image
     */
    public static function setLargePicture (string $picture, $filename = null)
    {
        self::setPicture($picture, self::$formats['large'], $filename);
    }

    /**
     * Create a picture with given format
     * @param string $picture
     * @param array $format
     * @param string $filename
     * @return \Intervention\Image\Image
     */
    public static function setPicture (string $picture, array $format, string $filename = null)
    {
        return Image::make($picture)
            ->resize($format[0], $format[1], function ($constraint){
                $constraint->aspectRatio();
                $constraint->upsize();
            })
            ->save($filename);
    }

    /**
     * Get the dimensions and aspect ratio of the picture
     */
    public static function getDimension(string $picture)
    {
        $image  = Image::make($picture);
        $width  = $image->width();
        $height = $image->height();
        $ratio  = ($height / $width) * 100;

        return array(
            'width'     => $width,
            'height'    => $height,
            'ratio'     => $ratio
        );
    }
}