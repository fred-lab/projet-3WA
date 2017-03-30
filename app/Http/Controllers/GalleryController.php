<?php

namespace App\Http\Controllers;

use App\Http\Requests\GalleryRequest;
use App\Models\Gallery;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GalleryController extends Controller
{
    /**
     * GalleryController constructor.
     */
    public function __construct()
    {
        $this->middleware('auth:api');
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if(Auth::user()->level > 1){
            $galleries = Gallery::with(['pictures' => function($query){
                $query->where('has_focus', '=', '1');
            }])
                ->orderBy('created_at', 'desc')
                ->get();

            return $galleries;
        }
        else{
            return response()->json(
                ['error' => ['Vous n\'avez pas les droits nécessaires']], 401
            );
        }


    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\GalleryRequest  $request
     * @return \Illuminate\Http\Response
     * @return $gallery json
     */
    public function store(GalleryRequest $request)
    {
        if(Auth::user()->level > 1){
            $gallery = Gallery::create([
                'title'       => $request['title'],
                'description' => $request['description'],
                'category_id' => $request['category'],
                'date'        => $request['date'],
                'city'        => $request['city'],
                'price'       => $request['price'],
                'public'      => ($request['public'] == 1) ? 1 : 0
            ]);

            return ($request->ajax())
                ? $gallery
                : redirect(action('GalleryController@show', $gallery));
        }
        else{
            return response()->json(
                ['error' => ['Vous n\'avez pas les droits nécessaires']], 401
            );
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if (Auth::user()->level > 1) {
            $gallery = Gallery::with('pictures')->findOrFail($id);

            return $gallery;
        } else {
            return response()->json(
                ['error' => ['Vous n\'avez pas les droits nécessaires']], 401
            );
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\GalleryRequest  $request
     * @param  \App\Models\Gallery $gallery
     * @return \Illuminate\Http\Response
     */
    public function update(GalleryRequest $request, Gallery $gallery)
    {
        if(Auth::user()->level > 1){
            $gallery->update([
                'title'       => $request['title'],
                'description' => $request['description'],
                'category_id' => $request['category'],
                'date'        => $request['date'],
                'city'        => $request['city'],
                'price'       => $request['price'],
                'public'      => ($request['public'] == 1) ? 1 : 0
            ]);

            return ($request->ajax())
                ? $gallery->load('pictures')
                : redirect(action('GalleryController@show', $gallery));
        }
        else{
            return response()->json(
                ['error' => ['Vous n\'avez pas les droits nécessaires'], 401]
            );
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Gallery $gallery
     * @return \Illuminate\Http\Response
     */
    public function destroy(Gallery $gallery)
    {
        if(Auth::user()->level > 1){
            $gallery->delete();

            return (request()->ajax())
                ?  response()->json([ 'success' => 'Gallerie supprimée' ])
                : redirect(action('GalleryController@index'));
        }
        else{
            return response()->json(
                ['error' => ['Vous n\'avez pas les droits nécessaires']], 401
            );
        }

    }
}
