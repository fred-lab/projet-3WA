<h1>Création d'une gallerie</h1>

{!! Form::open([ 'route' => 'gallery.store', 'files' => true ]) !!}

{!! Form::text('title') !!}

{!! Form::textarea('description') !!}

{!! Form::file('image', ['multiple']) !!}

{!! Form::submit('Créer') !!}

{!! Form::close() !!}