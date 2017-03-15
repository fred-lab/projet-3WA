<?php

namespace App\Http\Controllers;

use App\Http\Requests\GalleryRequest;
use App\Models\Gallery;

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
        $galleries = Gallery::with(['pictures' => function($query){
            $query->where('has_focus', '=', '1');
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        return (request()->ajax())
            ? $galleries
            : view('gallery.index', compact('galleries'));
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
     * @return $gallery json
     */
    public function store(GalleryRequest $request)
    {
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

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $gallery = Gallery::with('pictures')->findOrFail($id);

        return (request()->ajax())
            ? $gallery
            : view('gallery.show', compact('gallery'));
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
    public function update(GalleryRequest $request, Gallery $gallery)
    {
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

        return (request()->ajax())
            ?  response()->json([ 'success' => 'Gallerie supprimée' ])
            : redirect(action('GalleryController@index'));
    }
}
