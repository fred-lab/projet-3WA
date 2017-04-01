<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('categories')->insert([
            'title' => 'portrait',
            'description' => 'La galerie portrait',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('categories')->insert([
            'title' => 'voyage',
            'description' => 'La galerie voyage',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('categories')->insert([
            'title' => 'mariage',
            'description' => 'La galerie mariage',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('categories')->insert([
            'title' => 'street',
            'description' => 'La galerie street',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
    }
}
