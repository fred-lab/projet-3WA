<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/



/**
 * Route group for the book section
 */
Route::group(['prefix' => 'book'], function (){
    dump(Route::get('{$id}', 'BookController@show')->name('book.show'));
});

/**
 * Route group for the studio section
 */
Route::group(['prefix' => 'studio'], function (){
    Route::get('/', 'StudioController@index')->name('studio.show');
});

Route::get('/', function () {
    return view('welcome');
});
