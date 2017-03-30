<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePicturesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pictures', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('path');
            $table->boolean('visible')->default(true)->comment('true if the picture can be visible by everybody in the gallery');
            $table->boolean('has_focus')->default(false)->index()->comment('true if the picture is use for preview');
            $table->string('thumb_name', 70)->nullable()->comment('the name of the preview picture');
            $table->string('original_name', 50)->index()->comment('nom original de la photo');
            $table->decimal('ratio', 5, 2)->unsigned()->comment('picture ratio');
            $table->smallInteger('width', false, true)->default(0)->comment('Width of the picture');
            $table->smallInteger('height', false, true)->default(0)->comment('Height of the picture');
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
        Schema::dropIfExists('pictures');
    }
}
