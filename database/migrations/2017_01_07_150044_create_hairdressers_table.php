<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHairdressersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hairdressers', function (Blueprint $table) {
            $table->increments('id');
            $table->enum('experience', ['débutant', 'expérimenté', 'confirmé'])->default('débutant');
            $table->enum('statut', ['amateur', 'semi-pro', 'professionnel'])->default('amateur');
            $table->boolean('compensation')->default(false)->comment('rémunération du coiffeur, par défaut : aucune');
            $table->text('price')->nullable()->comment('si rémunénation, les tarifs et conditions du coiffeur');
            $table->decimal('rank', 5, 2)->comment('note évaluant le coiffeur de 0 à 5');
            $table->text('comment')->comment('ressenti général sur le coiffeur et sa prestation');
            $table->boolean('makeup_artist')->default(false)->comment('indique si le coiffeur fait MUA');
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
        Schema::dropIfExists('hairdressers');
    }
}
