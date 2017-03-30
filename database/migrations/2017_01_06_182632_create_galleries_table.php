<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGalleriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('galleries', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title', 50)->unique();
            $table->text('description')->nullable();
            $table->string('slug', 50)->nullable();
            $table->tinyInteger('total_pictures')->unsigned()->nullable()->comment('the number of pictures of the gallery');
            $table->boolean('public')->default(false)->index()->comment('true if the gallery is public');
            $table->dateTime('date')->nullable()->comment('date du shooting');
            $table->string('address', 100)->nullable();
            $table->string('city', 20)->nullable();
            $table->decimal('zip_code', 5, 0)->unsigned()->nullable();
            $table->float('longitude', 10, 6)->unsigned()->nullable()->comment('longitude GPS');
            $table->float('latitude', 10, 6)->unsigned()->nullable()->comment('latitude GPS');
            $table->decimal('price', 7, 2)->unsigned()->nullable()->comment('coût du shooting');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('galleries');
    }
}
