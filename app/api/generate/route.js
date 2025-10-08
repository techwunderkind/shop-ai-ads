import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
    try {
        const {name, price, features, targetAudience, painPoint, uniqueValue, tone} = await request.json();

        if (!name || !price || !features) {
            return Response.json({
                success: false,
                error: 'Ime izdelka, cena in funkcije so obvezni'
            }, {status: 400});
        }

        const toneDescriptions = {
            friendly: 'prijazen, topel in dostopen - kot razgovor s prijateljem',
            professional: 'profesionalen, zaupanja vreden in strokovni',
            urgent: 'nujen, energičen z jasnim pozivom k akciji',
            playful: 'igriv, zabaven in nekoliko humorističen'
        };

        const prompt = `Ti si Slovenec, strokovnjak za pisanje Facebook oglasov za Vigoshop. 
Piši kot NATIVE Slovenec - ne prevajalec! Uporabi kratek, udarni, pogovorni jezik.

PODATKI O IZDELKU:
- Ime: ${name}
- Cena: ${price}
- Ključne funkcije: ${features}
- Ciljna publika: ${targetAudience || 'splošni potrošniki'}
- Težava/Pain point: ${painPoint || 'N/A'}
- Edinstvena vrednost: ${uniqueValue || 'N/A'}
- Ton glasu: ${toneDescriptions[tone] || toneDescriptions.friendly}

PRAVILA ZA SLOVENSKI JEZIK:
❌ NIKOLI ne piši: "Ne zamudi priložnosti", "Ekskluzivna ponudba", "Revolucionarna rešitev"
✅ NAMESTO tega piši: "Hitro, zmanjkuje!", "Samo danes", "To moraš videt"
- Uporabljaj razgovorno slovenščino (kot da govoriš s prijateljem)
- Krajši stavki = boljši rezultat (idealno 5-8 besed za headline)
- Začni z močno besedo ali vprašanjem
- Uporabi "ti" obliko, ne "vi"
- Emojiiji so dobrodošli ampak ne vsak stavek
- Izogibaj se anglizmom razen če so res splošno uporabljeni (WiFi, HD OK)

STROGE OMEJITVE DOLŽINE:
- Headline: 25-38 znakov (ABSOLUTNO MAX 40)
- Body: 90-120 znakov (ABSOLUTNO MAX 125)
- Če ne moreš napisati znotraj omejitev, krajšaj stavke in odstranji nepotrebne besede!

TIPOLOGIJA 5 OGLASOV:

1. **Problem-Rešitev** (uporabljaj "Kako" ali "Ali tudi ti...")
   - Headline naj bo vprašanje ali problem
   - Body: Rešitev + ključna korist
   - Primer: "Otrok sam doma?" → "S kamero DIGICAM ga vidiš 24/7. Brez kablov, enostavna namestitev! 📱"

2. **FOMO/Urgenca** (uporablja "Samo", "Hitro", "Zadnji", "Zmanjkuje")
   - Headline z urgentno besedo
   - Body: Zakaj zdaj + kaj dobiš
   - Primer: "Zadnji kosi po tej ceni! ⚡" → "DIGICAM za varnost doma. Hitro, že čez 2 uri bo cena višja! 🔥"

3. **Korist-First** (začni z glavno koristjo)
   - Headline: Glavna korist (ne lastnost!)
   - Body: Kako to dobiš + zakaj je to super
   - Primer: "Vedno veš da so varni 👶" → "DIGICAM ti pokaže kaj se dogaja doma. Real-time, kristalno jasno tudi ponoči! 🌙"

4. **Socialni dokaz** (številke, popularnost)
   - Headline: Številka + korist ali socialni dokaz
   - Body: Zakaj že toliko ljudi to uporablja
   - Primer: "Že 5000+ Slovencev zaupa 🌟" → "DIGICAM je najbolj prodajana kamera letos. Enostavna in zanesljiva! 💪"

5. **Neposredni/Direct** (samo dejstva, brez fluffa)
   - Headline: Kaj je + ključna lastnost
   - Body: 3-4 ključne stvari v kratkih stavkih
   - Primer: "Varnostna kamera za 5 minut ⏰" → "DIGICAM: Brez kablov. Nočni vid. Aplikacija. Enostavno. 📱"

CALL TO ACTION variacije (izberi glede na tip):
- Problem-rešitev: "Poglej kako →", "Poskrbi za mir →"
- FOMO: "Naroči zdaj →", "Hitro v košarico →"
- Korist: "Poskrbi za varnost →", "Želim to →"
- Socialni: "Pridruži se jim →", "Tudi jaz hočem →"
- Neposredni: "Kupi zdaj →", "V košarico →"

DODATNE IZBOLJŠAVE:
- Ne ponavljaj imena izdelka v headline in body (dovolj je enkrat)
- V body lahko rečeš samo "Ta kamera" ali "Izdelek" namesto polnega imena
- Uporabljaj konkretne številke kjer je možno ("24/7", "5 minut", "1000+")
- Vsak oglas mora biti UNIKATEN pristop - različni emocije, različni stili

⚠️ KRITIČNO:
- Headline pod 40 znakov je ZAKON, ne predlog
- Body pod 125 znakov je ZAKON, ne predlog
- Če ne moreš skrajšati, prepiši drugače - nikoli ne prekorači limite!

VRNI SAMO JSON (brez \`\`\`json oznak):
[
  {
    "type": "Problem-Rešitev",
    "headline": "kratek udarni headline",
    "body": "kratek prepričljiv body",
    "rationale": "kratka razlaga zakaj to deluje",
    "cta": "Gumb tekst"
  }
]`;

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 3000,
            temperature: 0.9,
            messages: [
                {role: 'user', content: prompt}
            ]
        });

        let responseText = message.content[0].text;

        // Clean up markdown code blocks if present
        if (responseText.includes('```json')) {
            responseText = responseText.split('```json')[1].split('```')[0].trim();
        } else if (responseText.includes('```')) {
            responseText = responseText.split('```')[1].split('```')[0].trim();
        }

        const ads = JSON.parse(responseText);

        return Response.json({
            success: true,
            ads,
            usage: {
                inputTokens: message.usage.input_tokens,
                outputTokens: message.usage.output_tokens
            }
        });

    } catch (error) {
        console.error('Error generating ads:', error);
        return Response.json({
            success: false,
            error: error.message || 'Internal server error'
        }, {status: 500});
    }
}