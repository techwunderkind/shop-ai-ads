'use client';

import {useState} from 'react';

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
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-3 sm:p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <span className="text-3xl sm:text-4xl">✨</span>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                            Vigoshop AI Ad Generator Pro
                        </h1>
                    </div>
            

                    {/* URL Input Section */}
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span>🔗</span>
                            Naloži podatke iz Vigoshop povezave
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={productUrl}
                                onChange={(e) => setProductUrl(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && loadFromUrl()}
                                className="flex-1 px-3 sm:px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                                placeholder="https://vigoshop.si/izdelek/..."
                            />
                            <button
                                onClick={loadFromUrl}
                                disabled={loadingUrl}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition text-sm sm:text-base"
                            >
                                {loadingUrl ? '⏳' : '📥'} Naloži
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                            Prilepite povezavo do izdelka na Vigoshop in podatki se bodo avtomatsko naložili
                        </p>
                    </div>

                    {/* Quick Load Samples */}
                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                        <span className="text-xs sm:text-sm font-semibold text-gray-700 w-full sm:w-auto">Hitro testiranje:</span>
                        {sampleProducts.map((product, index) => (
                            <button
                                key={index}
                                onClick={() => loadSample(index)}
                                className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs sm:text-sm rounded-full transition"
                            >
                                {product.name.split(' ').slice(0, 2).join(' ')}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Ime izdelka *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                                placeholder="npr. Brezžična kamera DIGICAM"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Cena *
                            </label>
                            <input
                                type="text"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                                placeholder="npr. 33,99€"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Ključne funkcije * (ločeno z vejico)
                            </label>
                            <textarea
                                name="features"
                                value={formData.features}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                                placeholder="npr. Nočni vid, Dvosmerna komunikacija, WiFi povezava"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Ciljna publika
                            </label>
                            <input
                                type="text"
                                name="targetAudience"
                                value={formData.targetAudience}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                                placeholder="npr. starši, lastniki domov"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Težava, ki jo rešuje
                            </label>
                            <input
                                type="text"
                                name="painPoint"
                                value={formData.painPoint}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                                placeholder="npr. Skrbi za varnost doma"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Edinstvena vrednost
                            </label>
                            <input
                                type="text"
                                name="uniqueValue"
                                value={formData.uniqueValue}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                                placeholder="npr. Zaščitite svoj dom 24/7"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Ton glasu
                            </label>
                            <select
                                name="tone"
                                value={formData.tone}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                            >
                                <option value="friendly">Prijazen & dostopen</option>
                                <option value="professional">Profesionalen</option>
                                <option value="urgent">Nujen & aktiven</option>
                                <option value="playful">Igriv & zabaven</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                            <span className="text-red-600 text-sm sm:text-base">⚠️</span>
                            <p className="text-red-700 text-sm sm:text-base">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={generateAds}
                        disabled={loading}
                        className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 sm:px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                <span className="hidden sm:inline">Generiranje z AI...</span>
                                <span className="sm:hidden">Generiranje...</span>
                            </>
                        ) : (
                            <>
                                <span>✨</span>
                                <span className="hidden sm:inline">Generiraj 5 oglasov z Claude AI</span>
                                <span className="sm:hidden">Generiraj oglase</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Generated Ads */}
                {generatedAds.length > 0 && (
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                                🎯 AI-Generirana oglasna besedila
                            </h2>
                            <button
                                onClick={exportAds}
                                className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition text-sm sm:text-base"
                            >
                                <span>📥</span>
                                Izvozi vse
                            </button>
                        </div>

                        {generatedAds.map((ad, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition duration-200 border-l-4 border-purple-500"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <span className="inline-block bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                                            {ad.type}
                                        </span>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 break-words">
                                            {ad.headline}
                                        </h3>
                                        <p className={`text-xs font-medium ${getCharacterCountColor(ad.headline, 40)}`}>
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
                                        className="p-2 hover:bg-gray-100 rounded-lg transition duration-200 flex-shrink-0 ml-2"
                                        title="Kopiraj oglas"
                                    >
                                        {copiedIndex === index ? (
                                            <span className="text-green-600 text-xl">✓</span>
                                        ) : (
                                            <span className="text-gray-600 text-xl">📋</span>
                                        )}
                                    </button>
                                </div>

                                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-3 sm:p-4 mb-3">
                                    <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line leading-relaxed break-words">
                                        {ad.body}
                                    </p>
                                    <p className={`text-xs mt-2 font-medium ${getCharacterCountColor(ad.body, 125)}`}>
                                        {ad.body?.length || 0}/125 znakov {ad.body?.length > 125 && '⚠️ PREDOLGO'}
                                    </p>
                                </div>

                                {ad.cta && (
                                    <div className="mb-3">
                                        <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 sm:px-6 py-2 rounded-lg cursor-pointer transition">
                                            {ad.cta} →
                                        </span>
                                    </div>
                                )}

                                <div className="text-xs sm:text-sm text-gray-600 bg-purple-50 rounded-lg p-3 border-l-4 border-purple-300">
                                    <strong className="text-purple-800">💡 Zakaj deluje:</strong> {ad.rationale}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}