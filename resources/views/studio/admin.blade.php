@extends('layout')

@section('content')
    <div class="admin-container">
        <div class="sidebar">
            <nav class="admin-nav">
                <h2>Galleries</h2>
                <a href="{{ route('gallery.index') }}">Index des galleries</a>
                <a href="{{ route('gallery.create') }}">Créer une gallerie</a>
                <h2>Utilisateur</h2>
                <a href="#" title="Work in progress">Liste des utilisateurs</a>
                <a href="#" title="Work in progress">Ajouter un utilisateur</a>
            </nav>
        </div>
        <section class="admin-view">
            @yield('admin-content')
            <admin-galleries></admin-galleries>
        </section>
    </div>
@endsection