<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/**
 * Route group for the book section
 */
Route::group(['prefix' => 'book'], function (){
    Route::get('{$id}', 'BookController@show')->name('book.show');
});

/**
 * Route group for the studio section
 */
Route::group(['prefix' => 'studio'], function (){
    Route::get('/', 'StudioController@index')->name('studio.show');
    Route::resource('gallery', 'GalleryController');
});

/**
 * Routes for the Homepage
 */
Route::get('preview', function (){
    return App\Models\Gallery::with('pictures')
        ->orderBy('created_at', 'desc')
        ->limit(5)
        ->get()->toJson();
});

Route::resource('/', 'HomeController');
