<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;
    protected $table = 'cars';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';
    protected $fillable = [
        'name',
        'plate_number',
        'brand',
        'year',
        'price_per_day',
        'car_photo',
        'status',
    ];

    public function transactions() {
        return $this->hasMany(Transaction::class);
    }
}
