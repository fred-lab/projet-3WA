<?php
/**
 * Created by IntelliJ IDEA.
 * User: fred
 * Date: 28/01/17
 * Time: 11:02
 */

namespace App\Services;


use App\Models\Gallery;
use App\Models\Category;
use App\Models\Picture;
use Intervention\Image\ImageManagerStatic as Image;
use Mockery\CountValidator\Exception;

class FilesManager
{
    /**
     * When a gallery is create, upload/move pictures into folder
     *
     * @param array $pictures
     * @param \App\Models\Gallery $gallery
     * @return \App\Models\Gallery $gallery
     */
    public static function upload (array $pictures = null, Gallery $gallery)
    {
        if(!empty($pictures)){
            //get a dir path
            $dir = self::getPictureDir($gallery);

            $storePictures = self::storePicture($gallery, $pictures, $dir);

            if (!$storePictures){
                $gallery->delete();

                throw new Exception('An unexpected error has occurred while saving the pictures. The gallery was deleted ');
            }
        }

        return $gallery;
    }

    /**
     * get the picture dir
     *
     * @param object Gallery $gallery
     * @return string
     * public_path() = "/var/www/public"
     */
    public static function getPictureDir(Gallery $gallery)
    {
        $category = Category::findOrFail($gallery->category_id);
        return '/galeries/'. $category->title . '/' . $gallery->slug;
    }

    /**
     * store picture in database
     *
     * @param \App\Models\Gallery $gallery, array $pictures, string $dir
     * @return boolean
     */
    public static function storePicture(Gallery $gallery, array $pictures, string $dir)
    {
        Image::configure(array('driver' => 'imagick'));
        //if dir is not empty, count the number of pictures
        $count = count($gallery->pictures()->get());

        foreach ($pictures as $index => $picture){
            $rank = $index + $count  + 1;

            //check the size of the file
            if($picture->getClientSize() > 20000000){
                throw new Exception('The file size exceeds the limit of size allowed');
            }

            if($picture->isValid()){

                $focus          = ($index == 0 && !request()->has('has_focus')) ? true : false ;
                $thumbName      = ($focus) ? $gallery->slug . '-preview.' . $picture->getClientOriginalExtension() : null;
                $filename       = $gallery->slug . '-' . $rank. '.' . $picture->getClientOriginalExtension();
                $originalName   = $picture->getClientOriginalName();

                // check for duplicate picture
                self::checkPicture($gallery, 'original_name', $originalName);

                $savePicture = $gallery->pictures()->create([
                    'title'         => $filename,
                    'path'          => $dir,
                    'original_name' => $originalName,
                    'has_focus'     => $focus,
                    'thumb_name'    => $thumbName,
                    'ratio'         => 1
                ]);

                if ($savePicture) {
                    $picture->move(public_path() . $dir, $filename );
                    ($focus) ? PicturesManager::setThumbsPicture(public_path() . $dir. '/' .$filename, public_path() . $dir. '/' .$thumbName) : null;
                    PicturesManager::setLargePicture(public_path() . $dir. '/' .$filename);
                    $dimension = PicturesManager::getDimension(public_path() . $dir . '/' . $filename);

                    $gallery->pictures()->update([
                        'width'     => $dimension['width'],
                        'height'    => $dimension['height'],
                        'ratio'     => $dimension['ratio']
                    ]);
                }
                else {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * when a gallery is updated from database, update the dir
     *
     * @param \App\Models\Gallery $gallery
     * @return void
     */
    public static function updateGallery(Gallery $gallery, $oldSlug)
    {
        $category   = Category::findOrFail($gallery->category_id);
        $dirPath    = public_path() . '/galeries/'. $category->title . '/' . $oldSlug;

        if ($gallery->slug !== $oldSlug){
            if(is_dir($dirPath)){
                $files = scandir($dirPath);
                foreach ($files as $index => $file){
                    if($file != '.' && $file != '..'){

                        $fileName = $gallery->slug . '-' . ($index - 1) . '.jpg';
                        $thumbName = $gallery->slug.'-preview.jpg';
                        $filePath = self::getPictureDir($gallery);

                        $update = $gallery->pictures()->where('title', $file)->update([
                            'title' => $fileName,
                            'path'  => $filePath
                        ]);
                        $thumbUpdate = $gallery->pictures()->where('has_focus', 1)->update([
                            'thumb_name' => $thumbName
                        ]);

                        if($update){
                            rename($dirPath . '/' . $file , $dirPath . '/' . $fileName);
                        }
                        //rename the old picture preview if the file exist and the update is true
                        if($thumbUpdate && is_file($dirPath . '/' . $oldSlug . '-preview.jpg')){
                            rename($dirPath . '/' . $oldSlug . '-preview.jpg', $dirPath. '/' .$thumbName);
                        }
                    }
                }
                rename($dirPath, public_path() . '/galeries/'. $category->title . '/' . $gallery->slug);
            }
        }
    }

    /**
     * when a gallery is deleted from database, remove the folder with the picture
     * trigger by model's event "deleted"
     *
     * @param \App\Models\Gallery $gallery
     * @return void
     */
    public static function destroyGallery(Gallery $gallery)
    {
        $dirPath = public_path().self::getPictureDir($gallery);

        if(is_dir($dirPath)){
            $files = scandir($dirPath);
            foreach ($files as $file){
                $fileName = $dirPath . '/' . $file;
                self::destroyPicture($fileName);
            }
            rmdir($dirPath);
        }
        else{
            throw new Exception('An unexpected error has occurred while deleting the directory. No Directory was found. The gallery and its pictures have not been deleted ');
        }
    }

    /**
     * when a picture is deleted from database, remove the picture's file
     *
     * @param string $pathFile = the path of the file
     * @return void
     */
    public static function destroyPicture($pathFile)
    {
        if(is_file($pathFile) && pathinfo($pathFile, PATHINFO_EXTENSION) == "jpg"){
            unlink($pathFile);
        }
    }

    /**
     * Check if the picture already exist in the gallery, in this case, remove the picture
     *
     * @param \App\Models\Gallery $gallery, string $column, string $value
     * @return boolean
     */
    public static function checkPicture (Gallery $gallery, string $column, string $value)
    {
        $query = $gallery->pictures()->where($column, $value)->get();

        if(!$query->isEmpty()){
            foreach ($query as $picture){
                $pathDir        = $picture->path;
                $pictureName    = $picture->title;
                self::destroyPicture($pathDir . '/' . $pictureName);
            }
        }
        return true;
    }



    /**
     * Check if the request has a key 'has_focus' and if, update the gallery with
     * a new picture's preview
     *
     * @param \App\Models\Gallery $gallery
     * @return void
     */
    public static function isPreview(Gallery $gallery)
    {
        if(request()->has('has_focus')){

            $oldPreview = $gallery->pictures()->where('has_focus', 1)->get();


            if (!empty($oldPreview) && request()->has_focus != $oldPreview[0]->id){

                // destroy the old preview's picture and update the database
                self::destroyPicture($oldPreview[0]->path. '/' .$oldPreview[0]->thumb_name);
                $oldPreview[0]->update([
                    'has_focus'     => false,
                    'thumb_name'    => null
                ]);

                // save the new preview's picture and create a jpeg
                $picture = $gallery->pictures()->where('id', request()->has_focus)->get();

                $picture[0]->update([
                    'has_focus'     => true,
                    'thumb_name'    => $gallery->slug. '-preview.jpg'
                ]);

                PicturesManager::setThumbsPicture(
                    public_path() . self::getPictureDir($gallery). '/' .$picture[0]->title,
                    public_path() . self::getPictureDir($gallery). '/' .$gallery->slug. '-preview.jpg'
                );
            }
        }
    }
}