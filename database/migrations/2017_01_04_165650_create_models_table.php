<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateModelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('models', function (Blueprint $table) {
            $table->increments('id');
            $table->enum('experience', ['débutant', 'expérimenté', 'confirmé'])->default('débutant');
            $table->enum('statut', ['amateur', 'semi-pro', 'professionnel'])->default('amateur');
            $table->boolean('compensation')->default(false)->comment('rémunération du modèle, par défaut : aucune');
            $table->text('price')->nullable()->comment('si rémunénation, les tarifs et conditions du modèle');
            $table->boolean('shoot_nude')->default(false);
            $table->json('genres')->nullable()->comment('Les différents styles de shooting du modèle');
            $table->dateTime('dob')->nullable()->comment('date de naissance');
            $table->boolean('sex')->default(true)->comment('par défaut : femme');
            $table->integer('height')->unsigned()->nullable()->comment('taille');
            $table->integer('weight')->unsigned()->nullable()->comment('poids');
            $table->enum('figure', ['fine', 'normale', 'ronde', 'athlétique'])->comment('le type de silhouette du modèle');
            $table->string('cup', 50)->nullable()->comment('le tour de poitrine et le bonnet');
            $table->integer('shoes')->nullable()->unsigned()->comment('pointure');
            $table->integer('dress')->nullable()->unsigned()->comment('taille de robe');
            $table->string('hair_color', 20)->nullable();
            $table->string('eye_color', 20)->nullable();
            $table->boolean('tattoo')->default(false);
            $table->boolean('piercings')->default(false);
            $table->string('ethnicity', 20)->nullable();
            $table->decimal('rank', 5, 2)->comment('note évaluant le modèle de 0 à 5');
            $table->text('comment')->comment('ressenti général sur le modèle et ses shootings');
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
        Schema::dropIfExists('models');
    }
}
