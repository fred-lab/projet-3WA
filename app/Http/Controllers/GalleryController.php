<?php

namespace App\Http\Controllers;

use App\Models\Gallery;

use App\Services\FilesManager;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    /**
     * GalleryController constructor.
     */
    public function __construct()
    {
        //ajouter le middleware auth pour restreindre l'accès
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $galleries = Gallery::All();

        return view('gallery.index', compact('galleries'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('gallery.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->all();
        // create a gallery
        $gallery = new Gallery();
        $gallery->title = $data['title'];
        $gallery->description = $data['description'];
        $gallery->category_id = $data['category']; // trouver un moyen de récupérer l'id de la gallerie
        $gallery->save();

        return redirect(action('GalleryController@show', $gallery));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $gallery = Gallery::findOrFail($id);

        $pictures = $gallery->pictures()->get();

        // eadger loading !!

        return view('gallery.show', compact('gallery', 'pictures'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Gallery $gallery
     * @return \Illuminate\Http\Response
     */
    public function edit(Gallery $gallery)
    {
        $pictures = $gallery->pictures()->get();
        return view('gallery.edit', compact('gallery', 'pictures'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Gallery $gallery
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Gallery $gallery)
    {
//        dd($request->all());
        $data = $request->all();
        $gallery->title = $data['title'];
        $gallery->description = $data['description'];
        $gallery->category_id = $data['category'];
        $gallery->save();

        return redirect(action('GalleryController@show', $gallery));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $gallery = Gallery::findOrFail($id);
        $gallery->delete();

        return redirect(action('GalleryController@index'));
    }
}
