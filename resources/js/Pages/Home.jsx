import React, { useEffect, useState } from 'react';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [verses, setVerses] = useState([]);
    const [selectedBook, setSelectedBook] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    const [selectedVerse, setSelectedVerse] = useState('');
    const [verseContent, setVerseContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await fetch('/bible-books');
                const data = await response.json();
                setBooks(data.books);
            } catch (err) {
                setError('Failed to fetch books');
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const fetchChapters = async (bookId) => {
        try {
            setLoading(true);
            const response = await fetch(`/bible-chapters/${bookId}`);
            const data = await response.json();
            setChapters(data.chapters);
            setSelectedChapter('');
            setVerses([]);
            setSelectedVerse('');
            setVerseContent('');
        } catch (err) {
            setError('Failed to fetch chapters');
        } finally {
            setLoading(false);
        }
    };

    const fetchVerses = async (chapterId) => {
        try {
            setLoading(true);
            const response = await fetch(`/bible-chapters/${chapterId}/verses`);
            const data = await response.json();
            setVerses(data.verses);
        } catch (err) {
            setError('Failed to fetch verses');
        } finally {
            setLoading(false);
        }
    };

    const fetchVerseContent = async (verseId) => {
        try {
            setLoading(true);
            const response = await fetch(`/bible-verses/${verseId}`);
            const data = await response.json();
            setVerseContent(data.verse.content);
        } catch (err) {
            setError('Failed to fetch verse content');
        } finally {
            setLoading(false);
        }
    };

    // Toggle dark/light mode
    const toggleTheme = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} min-h-screen p-4`}>
            {/* Navigation Bar */}
            <nav className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} p-4 flex justify-between`}>
                <h1 className="text-xl">Bible App</h1>
                <ul className="flex space-x-4">
                    <li><a href="#" className="hover:text-gray-300">Home</a></li>
                </ul>
                {/* Theme Toggle Button */}
                <button 
                    className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900'} p-2 rounded-md`}
                    onClick={toggleTheme}
                >
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </nav>

            {/* Main Content */}
            <div className="md:w-1/2 w-full mx-auto p-4">
                <h1 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-2xl mb-4`}>Bible App</h1>

                {error && <div className="text-red-500 mb-4">{error}</div>}
                {loading && <div className="text-gray-500">Loading...</div>}

                {/* Book Selection */}
                <div className="mb-4">
                    <select
                        className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} border border-gray-600 p-2 rounded-md w-full`}
                        onChange={(e) => {
                            const bookId = e.target.value;
                            setSelectedBook(bookId);
                            fetchChapters(bookId);
                        }}
                        defaultValue=""
                    >
                        <option value="" disabled>Select a book</option>
                        {books.map(book => (
                            <option 
                                key={book.id} 
                                value={book.id} 
                                className={`${selectedBook === book.id ? 'bg-blue-600' : ''}`}
                            >
                                {book.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Chapter Selection */}
                {selectedBook && chapters.length > 0 && (
                    <div className="mb-4">
                        <select
                            className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} border border-gray-600 p-2 rounded-md w-full`}
                            onChange={(e) => {
                                const chapterId = e.target.value;
                                setSelectedChapter(chapterId);
                                fetchVerses(chapterId);
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Select a chapter</option>
                            {chapters.map(chapter => (
                                <option 
                                    key={chapter.id} 
                                    value={chapter.id} 
                                    className={`${selectedChapter === chapter.id ? 'bg-blue-600' : ''}`}
                                >
                                    Chapter {chapter.number}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Verse Selection */}
                {selectedChapter && verses.length > 0 && (
                    <div className="mb-4">
                        <select
                            className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} border border-gray-600 p-2 rounded-md w-full`}
                            onChange={(e) => {
                                const verseId = e.target.value;
                                setSelectedVerse(verseId);
                                fetchVerseContent(verseId);
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Select a verse</option>
                            {verses.map(verse => (
                                <option 
                                    key={verse.id} 
                                    value={verse.id} 
                                    className={`${selectedVerse === verse.id ? 'bg-blue-600' : ''}`}
                                >
                                    {verse.reference}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Display Verse Content */}
                {verseContent && (
                    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} p-4 rounded-md shadow-md mt-4 text-${isDarkMode ? 'white' : 'gray-900'}`}>
                        <h2 className="text-2xl mb-2">{selectedVerse}</h2>
                        <p>{verseContent}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
