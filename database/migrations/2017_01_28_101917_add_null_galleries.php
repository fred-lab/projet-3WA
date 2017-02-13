<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddNullGalleries extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('galleries', function (Blueprint $table) {
            $table->dateTime('date')->nullable()->comment('date du shooting')->change();
            $table->float('longitude', 10, 6)->unsigned()->nullable()->comment('longitude GPS')->change();
            $table->float('latitude', 10, 6)->unsigned()->nullable()->comment('latitude GPS')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('galleries', function (Blueprint $table) {
            $table->dateTime('date')->comment('date du shooting')->change();
            $table->float('longitude', 10, 6)->unsigned()->comment('longitude GPS')->change();
            $table->float('latitude', 10, 6)->unsigned()->comment('latitude GPS')->change();
        });
    }
}
