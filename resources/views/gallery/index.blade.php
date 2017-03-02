@extends('studio.admin')

@section('admin-content')
<h1>Index des galleries</h1>

    @foreach($galleries as $gallery)
        <img src="#" alt="{{ $gallery->slug  }}">
    @endforeach

    <pre>{{ $galleries }}</pre>

@endsection