'use client';

import {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        features: '',
        targetAudience: '',
        painPoint: '',
        uniqueValue: '',
        tone: 'friendly'
    });

    const [loading, setLoading] = useState(false);
    const [generatedAds, setGeneratedAds] = useState([]);
    const [error, setError] = useState('');
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [productUrl, setProductUrl] = useState('');
    const [loadingUrl, setLoadingUrl] = useState(false);
    const router = useRouter();

    // Sample products for quick testing
    const sampleProducts = [
        {
            name: 'Brezžična varnostna kamera',
            price: '29,99€',
            features: 'Nočni vid, WiFi, Aplikacija, Vodoodporna, Full HD',
            targetAudience: 'Starši z otroki, lastniki hiš',
            painPoint: 'Skrb za varnost doma ko nisi tam',
            uniqueValue: 'Vidiš dom v živo kadarkoli - enostavna namestitev brez strokovnjaka'
        },
        {
            name: 'EMS Trebušni trener',
            price: '19,99€',
            features: 'Električna stimulacija, 6 programov, USB polnjenje, Brezžičen',
            targetAudience: 'Zaposleni 25-45 let brez časa za fitnes',
            painPoint: 'Ni časa za fitnes ampak željo po fiti postavi',
            uniqueValue: 'Trebušački v 15 minutah na kavču - brez znoja'
        },
        {
            name: 'Ultrazvočni čistilec zob',
            price: '24,99€',
            features: 'Odstrani zobni kamen, 3 nastavki, USB polnjenje, Tiho delovanje',
            targetAudience: 'Ljudje ki skrbijo za zobe, 20-60 let',
            painPoint: 'Draga zobna higiena pri zobozdravniku',
            uniqueValue: 'Profesionalno čiščenje doma za 1/10 cene'
        }
    ];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const loadSample = (index) => {
        setFormData({...sampleProducts[index], tone: formData.tone});
        setError('');
    };

    const loadFromUrl = async () => {
        if (!productUrl.trim()) {
            setError('Prosimo vnesite URL izdelka');
            return;
        }

        if (!productUrl.includes('vigoshop.si')) {
            setError('Trenutno podpiramo samo Vigoshop.si povezave');
            return;
        }

        setLoadingUrl(true);
        setError('');

        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({url: productUrl})
            });

            const data = await response.json();

            if (data.success) {
                setFormData({
                    ...formData,
                    name: data.product.name || '',
                    price: data.product.price || '',
                    features: data.product.features || '',
                    targetAudience: data.product.targetAudience || '',
                    painPoint: data.product.painPoint || '',
                    uniqueValue: data.product.uniqueValue || ''
                });
                setProductUrl('');
            } else {
                setError(data.error || 'Napaka pri nalaganju podatkov');
            }
        } catch (err) {
            setError('Napaka pri povezavi: ' + err.message);
        } finally {
            setLoadingUrl(false);
        }
    };

    const generateAds = async () => {
        if (!formData.name || !formData.price || !formData.features) {
            setError('Prosimo izpolnite vsaj ime izdelka, ceno in funkcije');
            return;
        }

        setLoading(true);
        setError('');
        setGeneratedAds([]);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setGeneratedAds(data.ads);
            } else {
                setError(data.error || 'Napaka pri generiranju oglasov');
            }
        } catch (err) {
            setError('Napaka pri povezavi: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const getCharacterCountColor = (text, maxLength) => {
        const length = text?.length || 0;
        if (length > maxLength) return 'text-red-600 font-bold';
        if (length > maxLength * 0.9) return 'text-yellow-600';
        return 'text-green-600';
    };

    const exportAds = () => {
        const content = generatedAds.map((ad, i) =>
            `=== OGLAS ${i + 1}: ${ad.type} ===\n\n` +
            `HEADLINE: ${ad.headline}\n` +
            `(${ad.headline.length}/40 znakov)\n\n` +
            `BODY:\n${ad.body}\n` +
            `(${ad.body.length}/125 znakov)\n\n` +
            `CTA: ${ad.cta}\n\n` +
            `ZAKAJ DELUJE: ${ad.rationale}\n\n` +
            `---\n\n`
        ).join('');

        const blob = new Blob([content], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.name.replace(/\s+/g, '_')}_ads.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 p-3 sm:p-4 lg:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="glass-effect rounded-3xl shadow-modern hover-lift transition-modern p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                        <div className="flex items-center gap-3 sm:gap-4 mb-4">
                            <div className="relative">
                                <span className="text-4xl sm:text-5xl animate-pulse-glow">✨</span>
                                <div className="absolute inset-0 text-4xl sm:text-5xl blur-sm opacity-30">✨</div>
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Vigoshop AI Ad Generator
                                </h1>
                                <p className="text-sm sm:text-base text-gray-600 mt-1">
                                </p>
                            </div>
                        </div>
            

                        {/* URL Input Section */}
                        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-indigo-50/80 via-purple-50/80 to-pink-50/80 rounded-2xl border border-indigo-200/50 shadow-lg hover-lift transition-modern">
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <span className="text-lg">🔗</span>
                                <span>Naloži podatke iz Vigoshop povezave</span>
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={productUrl}
                                    onChange={(e) => setProductUrl(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && loadFromUrl()}
                                    className="flex-1 px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-sm sm:text-base transition-modern focus-modern"
                                    placeholder="https://vigoshop.si/izdelek/..."
                                />
                                <button
                                    onClick={loadFromUrl}
                                    disabled={loadingUrl}
                                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-modern shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    {loadingUrl ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            <span>Nalagam...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>📥</span>
                                            <span>Naloži</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-600 mt-3 bg-white/60 rounded-lg p-2 border border-gray-200/50">
                                💡 Prilepite povezavo do izdelka na Vigoshop in podatki se bodo avtomatsko naložili
                            </p>
                        </div>

                        {/* Quick Load Samples */}
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <span>⚡</span>
                                    <span>Hitro testiranje:</span>
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {sampleProducts.map((product, index) => (
                                    <button
                                        key={index}
                                        onClick={() => loadSample(index)}
                                        className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 text-indigo-800 text-sm rounded-full transition-modern hover-lift border border-indigo-200/50 shadow-sm hover:shadow-md"
                                    >
                                        {product.name.split(' ').slice(0, 2).join(' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <span className="text-indigo-600">📦</span>
                                    <span>Ime izdelka *</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-sm sm:text-base transition-modern focus-modern shadow-sm"
                                    placeholder="npr. Brezžična kamera DIGICAM"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <span className="text-green-600">💰</span>
                                    <span>Cena *</span>
                                </label>
                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-sm sm:text-base transition-modern focus-modern shadow-sm"
                                    placeholder="npr. 33,99€"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <span className="text-blue-600">⚡</span>
                                    <span>Ključne funkcije * (ločeno z vejico)</span>
                                </label>
                                <textarea
                                    name="features"
                                    value={formData.features}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-sm sm:text-base transition-modern focus-modern shadow-sm resize-none"
                                    placeholder="npr. Nočni vid, Dvosmerna komunikacija, WiFi povezava"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <span className="text-purple-600">🎯</span>
                                    <span>Ciljna publika</span>
                                </label>
                                <input
                                    type="text"
                                    name="targetAudience"
                                    value={formData.targetAudience}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-sm sm:text-base transition-modern focus-modern shadow-sm"
                                    placeholder="npr. starši, lastniki domov"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <span className="text-red-600">🔥</span>
                                    <span>Težava, ki jo rešuje</span>
                                </label>
                                <input
                                    type="text"
                                    name="painPoint"
                                    value={formData.painPoint}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-sm sm:text-base transition-modern focus-modern shadow-sm"
                                    placeholder="npr. Skrbi za varnost doma"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <span className="text-yellow-600">⭐</span>
                                    <span>Edinstvena vrednost</span>
                                </label>
                                <input
                                    type="text"
                                    name="uniqueValue"
                                    value={formData.uniqueValue}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-sm sm:text-base transition-modern focus-modern shadow-sm"
                                    placeholder="npr. Zaščitite svoj dom 24/7"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <span className="text-pink-600">🎭</span>
                                    <span>Ton glasu</span>
                                </label>
                                <select
                                    name="tone"
                                    value={formData.tone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-sm sm:text-base transition-modern focus-modern shadow-sm"
                                >
                                    <option value="friendly">Prijazen & dostopen</option>
                                    <option value="professional">Profesionalen</option>
                                    <option value="urgent">Nujen & aktiven</option>
                                    <option value="playful">Igriv & zabaven</option>
                                </select>
                            </div>
                    </div>

                        {error && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl flex items-start gap-3 shadow-lg">
                                <span className="text-red-600 text-lg flex-shrink-0">⚠️</span>
                                <p className="text-red-700 text-sm sm:text-base">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={generateAds}
                            disabled={loading}
                            className="w-full mt-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-2xl transition-modern shadow-lg hover:shadow-xl hover:shadow-indigo-500/25 disabled:shadow-none flex items-center justify-center gap-3 text-base sm:text-lg group"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin text-xl">⏳</span>
                                    <span className="hidden sm:inline">Generiranje z AI...</span>
                                    <span className="sm:hidden">Generiranje...</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-xl group-hover:scale-110 transition-transform">✨</span>
                                    <span className="hidden sm:inline">Generiraj 5 oglasov z Claude AI</span>
                                    <span className="sm:hidden">Generiraj oglase</span>
                                </>
                            )}
                        </button>
                </div>

                    {/* Generated Ads */}
                    {generatedAds.length > 0 && (
                        <div className="space-y-6 sm:space-y-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        🎯 AI-Generirana oglasna besedila
                                    </h2>
                                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                                        Profesionalno optimizirani oglasi za maksimalno učinkovitost
                                    </p>
                                </div>
                                <button
                                    onClick={exportAds}
                                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 transition-modern shadow-lg hover:shadow-xl hover:shadow-green-500/25 font-semibold text-sm sm:text-base"
                                >
                                    <span>📥</span>
                                    <span>Izvozi vse</span>
                                </button>
                            </div>

                            {generatedAds.map((ad, index) => (
                                <div
                                    key={index}
                                    className="glass-effect rounded-2xl shadow-modern hover-lift transition-modern p-6 sm:p-8 border border-indigo-200/50"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1">
                                            <span className="inline-block bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-indigo-200/50">
                                                {ad.type}
                                            </span>
                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 break-words leading-tight">
                                                {ad.headline}
                                            </h3>
                                            <p className={`text-sm font-medium ${getCharacterCountColor(ad.headline, 40)} bg-white/60 rounded-lg px-3 py-1 inline-block`}>
                                                {ad.headline?.length || 0}/40 znakov {ad.headline?.length > 40 && '⚠️ PREDOLGO'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                copyToClipboard(
                                                    `HEADLINE:\n${ad.headline}\n\nBODY:\n${ad.body}\n\nCTA:\n${ad.cta}`,
                                                    index
                                                )
                                            }
                                            className="p-3 hover:bg-indigo-50 rounded-xl transition-modern flex-shrink-0 ml-4 border border-gray-200 hover:border-indigo-300 group"
                                            title="Kopiraj oglas"
                                        >
                                            {copiedIndex === index ? (
                                                <span className="text-green-600 text-2xl group-hover:scale-110 transition-transform">✓</span>
                                            ) : (
                                                <span className="text-gray-600 text-2xl group-hover:text-indigo-600 group-hover:scale-110 transition-all">📋</span>
                                            )}
                                        </button>
                                    </div>

                                    <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 rounded-xl p-4 sm:p-6 mb-4 border border-indigo-100/50">
                                        <p className="text-base sm:text-lg text-gray-700 whitespace-pre-line leading-relaxed break-words">
                                            {ad.body}
                                        </p>
                                        <p className={`text-sm mt-3 font-medium ${getCharacterCountColor(ad.body, 125)} bg-white/60 rounded-lg px-3 py-1 inline-block`}>
                                            {ad.body?.length || 0}/125 znakov {ad.body?.length > 125 && '⚠️ PREDOLGO'}
                                        </p>
                                    </div>

                                    {ad.cta && (
                                        <div className="mb-4">
                                            <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold px-6 py-3 rounded-xl cursor-pointer transition-modern shadow-lg hover:shadow-xl hover:shadow-blue-500/25 group">
                                                {ad.cta} <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-sm text-gray-600 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl p-4 border border-purple-200/50">
                                        <strong className="text-purple-800 flex items-center gap-2 mb-2">
                                            <span>💡</span>
                                            <span>Zakaj deluje:</span>
                                        </strong>
                                        <p className="leading-relaxed">{ad.rationale}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}