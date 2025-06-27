<?php

namespace App\Repositories\Interfaces;

interface RepositoryInterface
{
    /**
     * Get all resources
     *
     * @param array $columns
     * @return mixed
     */
    public function all($columns = ['*']);

    /**
     * Get paginated resources
     *
     * @param int $perPage
     * @param array $columns
     * @return mixed
     */
    public function paginate($perPage = 15, $columns = ['*']);

    /**
     * Create a resource
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data);

    /**
     * Update a resource
     *
     * @param array $data
     * @param $id
     * @return mixed
     */
    public function update(array $data, $id);

    /**
     * Delete a resource
     *
     * @param $id
     * @return mixed
     */
    public function delete($id);

    /**
     * Find a resource by id
     *
     * @param $id
     * @param array $columns
     * @return mixed
     */
    public function find($id, $columns = ['*']);

    /**
     * Find a resource by specific column
     *
     * @param $field
     * @param $value
     * @param array $columns
     * @return mixed
     */
    public function findBy($field, $value, $columns = ['*']);
}
