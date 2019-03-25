<?php

namespace App\Console\Commands;

use App\Services\TokenManager;
use Illuminate\Console\Command;

class GenerateParameters extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bokehlicious:token {id=2 : The id of the public token user}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update the parameters.json file with the public client token information';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $id = $this->argument('id');

        $token = new TokenManager();

        $isUpdate = $token->updateParametersFile($id);

        if($isUpdate){
            $this->info('Parameters.json is updated correctly!');
        } else {
            $this->error('An error occurred : Parameters.json has not been updated correctly !');
        }
    }
}
