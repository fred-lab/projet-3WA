@extends('layout')

@section('content')
    <section class="galleries">
        <router-view></router-view>
    </section>
    <section class="about">
        {{--la zone about--}}
    </section>
    <section class="contact">
        {{-- formulaire de contact--}}
    </section>
@endsection