<?php
/**
 * Created by IntelliJ IDEA.
 * User: fred
 * Date: 28/01/17
 * Time: 11:02
 */

namespace App\Services;


use App\Models\Gallery;

class FilesManager
{
    /**
     * Create a gallery and upload/move pictures into folder
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
            }
        }
        //to do : gestion des erreurs
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
        return public_path() . '/portrait/' . $gallery->slug;
    }

    /**
     * store picture in database
     *
     * @param \App\Models\Gallery $gallery, array $pictures, string $dir
     * @return boolean
     */
    public static function storePicture(Gallery $gallery, array $pictures, string $dir)
    {
        //if dir is not empty, count the number of pictures
        $count = count($gallery->pictures()->get());

        foreach ($pictures as $index => $picture){
            $rank = $index + $count  + 1;

            if($picture->isValid()){

                $filename = $gallery->slug . '-' . $rank. '.' . $picture->getClientOriginalExtension();
                $originalName = $picture->getClientOriginalName();

                // check for duplicate picture
                self::checkPicture($gallery, 'original_name', $originalName);

                $savePicture = $gallery->pictures()->create([
                    'title'         => $filename,
                    'path'          => $dir,
                    'original_name' => $originalName
                ]);

                if ($savePicture) {
                    $picture->move($dir, $filename );
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
        $dirPath = public_path() . '/portrait/' . $oldSlug;

        if ($gallery->slug !== $oldSlug){
            if(is_dir($dirPath)){
                $files = scandir($dirPath);
                foreach ($files as $index => $file){
                    if($file != '.' && $file != '..'){

                        $fileName = $gallery->slug . '-' . ($index - 1) . '.jpg';
                        $filePath = self::getPictureDir($gallery);

                        $query = $gallery->pictures()->where('title', $file)->update([
                            'title' => $fileName,
                            'path' => $filePath
                        ]);
                        if($query){
                            rename($dirPath . '/' . $file , $dirPath . '/' . $fileName);
                        }
                    }
                }
                rename($dirPath, public_path() . '/portrait/' . $gallery->slug);
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
        $dirPath = self::getPictureDir($gallery);

        if(is_dir($dirPath)){
            $files = scandir($dirPath);
            foreach ($files as $file){
                $fileName = $dirPath . '/' . $file;
                self::destroyPicture($fileName);
            }
            rmdir($dirPath);
        }
        // to do : gestion de l'erreur si il y a pas de dossier
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
                $pathDir = $picture->path;
                $pictureName = $picture->title;
                self::destroyPicture($pathDir . '/' . $pictureName);
            }
        }
        return true;
    }

}