<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 50);
            $table->string('email', 50);
            $table->string('title', 50);
            $table->text('message');
            $table->text('answer')->nullable()->comment('The answer to the message');
            $table->ipAddress('ip')->index()->comment('the user IP who send the mail');
            $table->boolean('answered')->default(false);
            $table->dateTime('answer_date')->nullable();
            $table->boolean('important')->default(false)->comment('True if the mail is important');
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
        Schema::dropIfExists('messages');
    }
}
