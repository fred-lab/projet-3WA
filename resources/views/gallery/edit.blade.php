<h1>Edition d'une gallerie</h1>


{!! Form::model($gallery, ['method' => 'PUT', 'route' => ['gallery.update', $gallery->id], 'files' => true ]) !!}

<p>Modification de la catégorie :</p>
{!! Form::select('category', ['1' => 'Portrait', '2' => 'Voyage', '3' => 'Mariage', '4' => 'Street'], $gallery->category_id) !!}

<p>Modification du titre :</p>
{!! Form::text('title') !!}

<p>Modification de la description :</p>
{!! Form::textarea('description', null, ['placeholder' => 'Décrivez cette galerie (optionnel)']) !!}

<p>Modifications des photos de la gallerie :</p>
@foreach($pictures as $picture)
    {{--{{ dump($picture) }}--}}
    <div>
        <img src="{{ $picture->path . '/' . $picture->title }}" alt="{{ $picture->title  }}" width="200">
        {!! Form::label('has_focus', 'Photo "preview" de la gallerie :') !!}
        {!! Form::radio('has_focus', $picture->id, $picture->has_focus) !!}
        {!!  Form::textarea('picture_description', null, ['placeholder' => 'Ajouter une desription à la photo (optionnel)']) !!}
    </div>

@endforeach

<p>Ajouter de nouvelles photos à la galerie :</p>
{!! Form::file('pictures[]', ['multiple']) !!}

<p>Enregistrer les modifications :</p>
{!! Form::submit('Modifier') !!}

{!! Form::close() !!}