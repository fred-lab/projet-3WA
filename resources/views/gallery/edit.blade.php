<h1>Edition d'une gallerie</h1>

{!! Form::model($gallery, ['method' => 'PUT', 'route' => ['gallery.update', $gallery->id], 'files' => true ]) !!}

{!! Form::text('title') !!}

{!! Form::textarea('description') !!}

{!! Form::file('pictures[]', ['multiple']) !!}

{!! Form::submit('Editer') !!}

{!! Form::close() !!}