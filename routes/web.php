<?php

use App\Http\Controllers\BibleController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/bible-books', [BibleController::class, 'getBooks']);
Route::get('/bible-chapters/{bookId}', [BibleController::class, 'getChapters']);
Route::get('/bible-chapters/{chapterId}/verses', [BibleController::class, 'getVerses']);
Route::get('/bible-verses/{verseId}', [BibleController::class, 'getVerseContent']);

require __DIR__.'/auth.php';
