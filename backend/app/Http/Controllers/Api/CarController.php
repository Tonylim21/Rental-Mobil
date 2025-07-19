<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CarController extends Controller
{
    // Menampilkan Semua Mobil
    public function index() {
        $cars = Car::latest()->get();

        // jika Belum Ada Mobil
        if ($cars->isEmpty()) {
            return response()->json([
                'message' => 'No Cars Added',
                'data' => [],
            ], 200);
        }

        return response()->json([
            'message' => 'Cars Retrieved Successfully',
            'data' => $cars,
        ], 200);
    }

    // Tambah Mobil
    public function store(Request $request) {
        // Validasi Input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'plate_number' => 'required|string|unique:cars,plate_number',
            'brand' => 'required|string',
            'year' => 'required|integer',
            'price_per_day' => 'required|numeric',
            'car_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->except('car_photo');

        if ($request->hasFile('car_photo')) {
            $file = $request->file('car_photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('public/car_photos', $filename);
            $data['car_photo'] = $filename; 
        }

        $car = Car::create($data);

        return response()->json([
            'message' => 'Car Created Successfully',
            'car' => $car
        ], 201);
    }

    // Detail Satu Mobil
    public function show(Car $car) {
        return response()->json($car);

        // Jika Tidak Ada Mobil yang Dipilih
        if (!$car) {
            return response()->json(['message' => 'No Car Choosed'], 400);
        }

        return response()->json([
            'message' => 'Car Retrieved Successfully',
            'data' => $car,
        ]);
    }

    // Update Mobil
    public function update(Request $request, Car $car) {
        $car = Car::find($car->id);

        if (!$car) {
            return response()->json(['message' => 'Car Not Found'], 404);
        }

        // Validasi Input
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'plate_number' => 'sometimes|required|string|unique:cars,plate_number,' . $car->id,
            'brand' => 'sometimes|required|string',
            'year' => 'sometimes|required|integer|digits:4',
            'price_per_day' => 'sometimes|required|numeric',
            'car_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'status' => 'sometimes|required|in:available,not_available',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Ambil Data Lolos Validasi
        $data = $validator->validated();

        // Cek & Proses File Upload
        if ($request->hasFile('car_photo')) {
            // Hapus Foto Lama
            if ($car->car_photo && Storage::exists('public/car_photos/' . basename($car->car_photo))) {
                Storage::delete('public/car_photos/' . basename($car->car_photo));
            }

            // Simpan Foto Baru dan Tambahkan ke $data
            $file = $request->file('car_photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('public/car_photos', $filename);
            
            // Simpan Path Lengkap Untuk Diakses Frontend
            $data['car_photo'] = url('storage/car_photos/' . $filename);
        }

        // UPDATE
        $car->update($data);

        return response()->json([
            'message' => 'Car Updated Successfully',
            'car' => $car
        ]);
    }

    // Hapus Mobil
    public function destroy(Car $car) {
        // Hapus Foto Mobil
        if ($car->car_photo && storage::exists('/public/car_photos/' . $car->car_photo)) {
            Storage::delete('/public/car_photos/' . $car->car_photo);
        }
        // Hapus Mobil
        $car->delete();

        return response()->json(['message' => 'Car Deleted Successfully'], 200);
    }
}