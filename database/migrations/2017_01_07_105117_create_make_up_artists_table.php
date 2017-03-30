<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMakeUpArtistsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('make_up_artists', function (Blueprint $table) {
            $table->increments('id');
            $table->enum('experience', ['débutant', 'expérimenté', 'confirmé'])->default('débutant');
            $table->enum('statut', ['amateur', 'semi-pro', 'professionnel'])->default('amateur');
            $table->boolean('compensation')->default(false)->comment('rémunération du MUA, par défaut : aucune');
            $table->text('price')->nullable()->comment('si rémunénation, les tarifs et conditions du MUA');
            $table->json('genres')->nullable()->comment('Les différents styles de prestation du MUA');
            $table->decimal('rank', 5, 2)->comment('note évaluant le MUA de 0 à 5');
            $table->text('comment')->comment('ressenti général sur le MUA et sa prestation');
            $table->boolean('hairdresser')->default(false)->comment('indique si le MUA fait coiffeur');
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
        Schema::dropIfExists('make_up_artists');
    }
}
