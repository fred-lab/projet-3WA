<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <title>Bokehlicious</title>

        <link rel="stylesheet" href="{{ elixir('css/app.css') }}">
    </head>
    <body id="app">
        @include('partials.header')

        @yield('content')

        @include('partials.footer')

        <script src="{{elixir('js/app.js')}}"></script>
    </body>
</html>
