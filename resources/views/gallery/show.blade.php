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

<div>
    @foreach($pictures as $picture)
        <img src="{{ asset('portrait/'. $gallery->slug . '/' . $picture->title) }}" alt=" photo ">
    @endforeach
</div>

