import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
    try {
        const {url} = await request.json();

        if (!url || !url.includes('vigoshop.si')) {
            return Response.json({
                success: false,
                error: 'Prosimo vnesite veljavno Vigoshop.si povezavo'
            }, {status: 400});
        }

        // Fetch the product page HTML
        const response = await fetch(url);
        const html = await response.text();

        // Use Claude to extract product information from HTML
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            temperature: 0.9,
            messages: [
                {
                    role: 'user',
                    content: `Analiziraj naslednjo HTML kodo Vigoshop izdelka in izvleci podatke. Vrni SAMO veljaven JSON brez markdown oznak.

HTML:
${html.substring(0, 15000)} 

Izvleci:
- name: ime izdelka (kratek, brez dodatnih opisov)
- price: cena v formatu "X,XX€"
- features: ključne funkcije/lastnosti (loči z vejico)
- targetAudience: ciljna publika (na podlagi izdelka - oceni kdo bi ga kupoval)
- painPoint: problem ki ga izdelek rešuje
- uniqueValue: edinstvena vrednost/korist

Vrni JSON v tej obliki:
{
  "name": "...",
  "price": "...",
  "features": "...",
  "targetAudience": "...",
  "painPoint": "...",
  "uniqueValue": "..."
}`
                }
            ]
        });

        let responseText = message.content[0].text;

        // Clean up markdown code blocks if present
        if (responseText.includes('```json')) {
            responseText = responseText.split('```json')[1].split('```')[0].trim();
        } else if (responseText.includes('```')) {
            responseText = responseText.split('```')[1].split('```')[0].trim();
        }

        const product = JSON.parse(responseText);

        return Response.json({
            success: true,
            product
        });

    } catch (error) {
        console.error('Error scraping product:', error);
        return Response.json({
            success: false,
            error: 'Napaka pri pridobivanju podatkov. Prosimo preverite povezavo.'
        }, {status: 500});
    }
}