<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
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