<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class BibleController extends Controller
{
    private $apiKey = 'ba1701d1301e3c1930c89060d355138e';
    private $bibleVersion = 'de4e12af7f28f599-02';

    public function getBooks()
    {
        $response = Http::withHeaders([
            'api-key' => $this->apiKey
        ])->get("https://api.scripture.api.bible/v1/bibles/{$this->bibleVersion}/books");

        if ($response->successful()) {
            $books = $response->json('data');
            return response()->json(['books' => $books]);
        }

        return response()->json(['error' => 'Failed to fetch books'], 500);
    }

    public function getChapters($bookId)
    {
        $response = Http::withHeaders([
            'api-key' => $this->apiKey
        ])->get("https://api.scripture.api.bible/v1/bibles/{$this->bibleVersion}/books/{$bookId}/chapters");

        if ($response->successful()) {
            $chapters = $response->json('data');
            return response()->json(['chapters' => $chapters]);
        }

        return response()->json(['error' => 'Failed to fetch Chapters'], 500);
    }

    public function getVerses($chapterId)
    {
        $response = Http::withHeaders([
            'api-key' => $this->apiKey
        ])->get("https://api.scripture.api.bible/v1/bibles/{$this->bibleVersion}/chapters/{$chapterId}/verses"); // Corrected line

        if ($response->successful()) {
            $verses = $response->json('data');
            return response()->json(['verses' => $verses]);
        }

        return response()->json(['error' => 'Failed to fetch verses'], 500);
    }

    public function getVerseContent($verseId)
    {
        $response = Http::withHeaders([
            'api-key' => $this->apiKey
        ])->get("https://api.scripture.api.bible/v1/bibles/{$this->bibleVersion}/verses/{$verseId}");

        if ($response->successful()) {
            $verseContent = strip_tags($response->json('data.content'));
            return response()->json(['verse' => ['content' => $verseContent]]);
        }

        return response()->json(['error' => 'Failed to fetch verse content'], 500);
    }
}
