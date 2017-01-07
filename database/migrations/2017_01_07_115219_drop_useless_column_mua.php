<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropUselessColumnMua extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('make_up_artists', function (Blueprint $table) {
            $table->dropColumn(
                ['last_name', 'slug', 'phones','email', 'email_failover', 'websites', 'address', 'city', 'zip_code']
            );
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('make_up_artists', function (Blueprint $table) {
            $table->string('last_name', 20);
            $table->string('slug', 50)->unique()->comment('nom du MUA slugifié pour son url');
            $table->json('phones');
            $table->string('email')->unique();
            $table->string('email_failover')->unique()->nullable()->comment('email de secours');
            $table->json('websites')->nullable();
            $table->string('address', 100)->nullable();
            $table->string('city', 20)->nullable();
            $table->integer('zip_code')->unsigned()->nullable();
        });
    }
}
