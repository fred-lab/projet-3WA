@extends('layout')

@section('content')
    <section class="galleries">
        {{--<transition name="focus-slide" mode="out-in">--}}
            <router-view></router-view>
        {{--</transition>--}}
    </section>
@endsection