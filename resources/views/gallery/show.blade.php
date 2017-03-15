@extends('studio.admin')

@section('admin-content')
    <div>
        <h1> {{ $gallery->title }}</h1>
    </div>

    <div>
        <p> {{ $gallery->description }}</p>
    </div>

    <div>
        <p> slug = {{ $gallery->slug }}</p>
    </div>

    <div>
        {!! Form::open([
            'method' => 'delete',
            'route' =>[
                'gallery.destroy', $gallery->id ]
            ]) !!}
        {!! Form::submit('Supprimer la gallerie') !!}
        {!! Form::close() !!}
    </div>

    <a href="{{ route('gallery.edit', $gallery->id) }}"><button>Editer la galerie</button></a>

    <div>
        @foreach($gallery->pictures as $picture)
            <img src="{{ asset($picture->path . '/' . $picture->title) }}" alt=" photo ">
        @endforeach
    </div>
@endsection
