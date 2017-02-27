<h1>Création d'une gallerie</h1>

<h2> Etape 1 : Créer une gallerie</h2>

{!! Form::open([ 'route' => 'gallery.store', 'files' => true ]) !!}

<p>Sélectionnez une catégorie :</p>
{!! Form::select('category', ['1' => 'Portrait', '2' => 'Voyage', '3' => 'Mariage', '4' => 'Street']) !!}

<p>Donnez un nom à la galerie :</p>
{!! Form::text('title') !!}

<p>Décrivez la galerie :</p>
{!! Form::textarea('description', null, ['placeholder' => 'Décrivez cette galerie (optionnel)']) !!}

<p>Choisissez les photos à ajouter à la galerie :</p>
{!! Form::file('pictures[]', ['multiple']) !!}

<p>Cliquez sur "Créer" pour créer la galerie et passer à l'étape d'édition de la galerie :</p>
{!! Form::submit('Créer la galerie') !!}

{!! Form::close() !!}