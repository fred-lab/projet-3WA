<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

/**
 * Class TokenManager : manage security token
 * @package App\Services
 */
class TokenManager
{
    /**
     * Get a client token from the database by its id
     *
     * @param int $id
     * @return mixed
     */
    private function getClientById(int $id)
    {
        return DB::table('oauth_clients')->where('id', $id)->first();
    }

    /**
     * Get the Parameters.json file
     *
     * @return bool|mixed
     */
    private function getParametersFile()
    {
        $parametersFile = base_path() . "/parameters.json";

        if (file_exists($parametersFile)) {
            return json_decode(file_get_contents($parametersFile), true);
        }

        return false;
    }

    /**
     * Update the Parameters.json file with the infos of the current token, from the database
     *
     * @param int $id
     * @return bool
     */
    public function updateParametersFile(int $id)
    {
        $client = $this->getClientById($id);

        $parameters = $this->getParametersFile();

        if(is_array($parameters) && array_key_exists('passport', $parameters) && array_key_exists('client_secret', $parameters['passport'])){
            $parameters['passport']['client_id'] = $client->id;
            $parameters['passport']['client_secret'] = $client->secret;

            $file = file_put_contents(base_path() . "/parameters.json", json_encode($parameters));

            return !$file ? false : true;
        }

        return false;
    }
}