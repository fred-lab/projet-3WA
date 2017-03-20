<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIndexGallery extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('galleries', function (Blueprint $table) {
            $table->index('public');
        });
        Schema::table('pictures', function (Blueprint $table) {
            $table->index('has_focus');
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
            $table->dropIndex('public');
        });
        Schema::table('pictures', function (Blueprint $table) {
            $table->dropIndex('has_focus');
        });
    }
}
