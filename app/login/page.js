'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                // Force a hard refresh to ensure middleware picks up the cookie
                console.log('Login successful, redirecting to:', window.location.origin + '/');
                console.log('Current location:', window.location.href);
                
                // Add a small delay to ensure cookie is set before redirect
                setTimeout(() => {
                    window.location.href = '/';
                }, 100);
            } else {
                setError(data.error || 'Prijava ni uspela');
            }
        } catch (err) {
            setError('Napaka pri povezavi: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
                <div className="text-center mb-6 sm:mb-8">
                    <span className="text-4xl sm:text-5xl mb-3 sm:mb-4 block">🔒</span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                        Vigoshop AI Ad Generator
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Prijavite se za dostop
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Uporabniško ime
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                            placeholder="Vnesite uporabniško ime"
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Geslo
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                            placeholder="Vnesite geslo"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                            <span className="text-red-600 flex-shrink-0">⚠️</span>
                            <p className="text-red-700 text-sm sm:text-base break-words">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                Prijavljanje...
                            </>
                        ) : (
                            <>
                                <span>🔓</span>
                                Prijava
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}