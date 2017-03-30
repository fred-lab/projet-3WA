<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddInfosUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('last_name', 20)->nullable();
            $table->string('slug', 50)->unique()->nullable()->comment('nom utilisateur slugifié pour son url');
            $table->text('phones')->nullable();
            $table->string('email_failover')->unique()->nullable()->comment('email de secours');
            $table->text('websites')->nullable();
            $table->string('address', 100)->nullable();
            $table->string('city', 20)->nullable();
            $table->integer('zip_code')->unsigned()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(
                ['last_name', 'slug', 'phones', 'email_failover', 'websites', 'address', 'city', 'zip_code']
            );
        });
    }
}
