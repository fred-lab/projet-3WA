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
 * Routes for the message
 */
Route::post('message', 'MessageController@store');
Route::post('ban', 'MessageController@ban');
Route::post('mass-delete', 'MessageController@massDelete');
Route::post('mass-ban', 'MessageController@massBan');

/**
 * Route group for the studio section
 */
Route::group(['prefix' => 'studio'], function (){
    Route::get('/', 'StudioController@index')->name('studio.show');
    Route::resource('gallery', 'GalleryController');
    Route::resource('picture', 'PictureController');
    Route::resource('message', 'MessageController', ['only' => ['index', 'show', 'update', 'destroy']]);
});
Route::get('preview-all', function (){
    return App\Models\Gallery::with(['pictures' => function($query){
        $query->where('has_focus', '=', '1');
    }])
        ->get()->toJson();
});

/**
 * Routes for the Homepage
 */
Route::get('preview', function (){
    return App\Models\Gallery::with(['pictures' => function($query){
        $query->where('has_focus', '=', '1');
    }])
        ->where('public', '=', '1')
        ->orderBy('created_at', 'desc')
        ->limit(5)
        ->get()->toJson();
});
Route::get('gallery/{slug}', function($slug){
    return App\Models\Gallery::with('pictures')
        ->where('slug', $slug)
        ->firstOrFail()->toJson();
});
Route::get('category/{category_id}', function($category_id){
    return App\Models\Gallery::with(['pictures' => function($query){
        $query->where('has_focus', '=', '1');
    }])
        ->where([
            ['category_id', $category_id],
            ['public', '=', '1']
        ])
        ->orderBy('created_at', 'desc')
        ->get()->toJson();
});

Route::resource('/', 'HomeController');
