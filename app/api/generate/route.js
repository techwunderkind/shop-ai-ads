import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
    try {
        const { name, price, features, targetAudience, painPoint, uniqueValue, tone } = await request.json();

        if (!name || !price || !features) {
            return Response.json({
                success: false,
                error: 'Ime izdelka, cena in funkcije so obvezni'
            }, { status: 400 });
        }

        const toneDescriptions = {
            friendly: 'prijazen, topel in dostopen - kot razgovor s prijateljem',
            professional: 'profesionalen, zaupanja vreden in strokovni',
            urgent: 'nujen, energičen z jasnim pozivom k akciji',
            playful: 'igriv, zabaven in nekoliko humorističen'
        };

        const prompt = `Ti si ekspert za pisanje Facebook oglasov za Vigoshop, slovensko e-trgovino. 
Ustvari 5 izjemno prepričljivih Facebook oglasnih variacij za naslednji izdelek:

PODATKI O IZDELKU:
- Ime: ${name}
- Cena: ${price}
- Ključne funkcije: ${features}
- Ciljna publika: ${targetAudience || 'splošni potrošniki'}
- Težava/Pain point: ${painPoint || 'N/A'}
- Edinstvena vrednost: ${uniqueValue || 'N/A'}
- Ton glasu: ${toneDescriptions[tone] || toneDescriptions.friendly}

KRITIČNE ZAHTEVE:
1. Piši v tekoči, naravni slovenščini (NE sme zveneti kot prevod!)
2. Vsak oglas mora vsebovati:
   - **headline** (MANJ kot 40 znakov - STROGA OMEJITEV!)
   - **body** (MANJ kot 125 znakov - STROGA OMEJITEV!)
   - **cta** (besedilo gumba za call-to-action)
3. Uporabi 5 različnih psiholoških pristopov:
   - **Problem-Rešitev**: Izpostavi problem in ponudi rešitev
   - **FOMO**: Nuja/omejitev/ekskluzivnost
   - **Korist-osredotočen**: Direktne koristi za uporabnika
   - **Socialni dokaz**: Zaupanje/priljubljenost/številke
   - **Neposredni**: Jasen, direkten pristop brez okraševanja

4. Naravno vključi relevantne emoji (ne pretiravam)
5. Naredi ga "scroll-stopping" - mora takoj pritegniti pozornost
6. Fokus na konverzijo - jasno vodenje do nakupa
7. Zveni pristno za slovensko kulturo in trg

⚠️ ABSOLUTNO KRITIČNO: 
- Headline MORA biti pod 40 znakov (idealno 30-38)
- Body MORA biti pod 125 znakov (idealno 100-120)
- Ne uporabljaj dolžin znakov kot opravičilo za slabo besedilo!

VRNI SAMO veljaven JSON (brez markdown oznak):
[
  {
    "type": "Problem-Rešitev",
    "headline": "kratek headline tukaj",
    "body": "body besedilo tukaj",
    "rationale": "kratko zakaj ta pristop deluje",
    "cta": "call to action tekst"
  }
]`;

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 3000,
            temperature: 0.9,
            messages: [
                { role: 'user', content: prompt }
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
        }, { status: 500 });
    }
}