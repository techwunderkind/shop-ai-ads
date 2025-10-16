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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden flex items-center justify-center p-3 sm:p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 w-full max-w-md">
                <div className="glass-effect rounded-3xl shadow-modern p-6 sm:p-8 w-full">
                    <div className="text-center mb-8">
                        <div className="relative mb-6">
                            <span className="text-5xl sm:text-6xl animate-pulse-glow block">🔒</span>
                            <div className="absolute inset-0 text-5xl sm:text-6xl blur-sm opacity-30">🔒</div>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                            Vigoshop AI Ad Generator
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600">
                            Varno se prijavite za dostop do AI orodja
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="text-indigo-600">👤</span>
                                <span>Uporabniško ime</span>
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-base transition-modern focus-modern shadow-sm"
                                placeholder="Vnesite uporabniško ime"
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="text-red-600">🔐</span>
                                <span>Geslo</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-base transition-modern focus-modern shadow-sm"
                                placeholder="Vnesite geslo"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl flex items-start gap-3 shadow-lg">
                                <span className="text-red-600 text-lg flex-shrink-0">⚠️</span>
                                <p className="text-red-700 text-base break-words">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-2xl transition-modern shadow-lg hover:shadow-xl hover:shadow-indigo-500/25 disabled:shadow-none flex items-center justify-center gap-3 text-base group"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin text-xl">⏳</span>
                                    <span>Prijavljanje...</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-xl group-hover:scale-110 transition-transform">🔓</span>
                                    <span>Prijava</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}