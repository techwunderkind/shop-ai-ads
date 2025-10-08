# 🚀 Vigoshop AI Ad Generator Pro

AI-powered Facebook ad generator for Slovenian e-commerce, powered by Claude Sonnet 4.5. Generate professional,
conversion-optimized ad copy in seconds.

## ✨ Features

- **🤖 AI-Powered Generation**: Leverages Claude Sonnet 4.5 for intelligent, native Slovenian ad copy
- **📊 5 Ad Type Variations**: Generates diverse ad approaches for A/B testing
    - Problem-Solution
    - FOMO/Urgency
    - Benefit-First
    - Social Proof
    - Direct/Factual
- **🔗 URL Scraping**: Auto-extracts product data from Vigoshop.si URLs
- **⚡ Quick Templates**: Pre-loaded sample products for instant testing
- **✅ Character Validation**: Real-time validation against Facebook's character limits
- **📥 Export Feature**: Download all generated ads as text file
- **🎨 Modern UI**: Gradient design with responsive layout

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **AI Model**: Claude Sonnet 4.5 (via Anthropic API)
- **Styling**: Tailwind CSS
- **Fonts**: Geist Sans & Geist Mono
- **Language**: JavaScript/React

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key

## 🚀 Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd vigoshop-ai-ad-generator
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

Get your API key from [Anthropic Console](https://console.anthropic.com/)

4. **Run the development server**

```bash
npm run dev
```

5. **Open in browser**

```
http://localhost:3000
```

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.js          # Ad generation endpoint
│   │   └── scrape/
│   │       └── route.js          # Product scraping endpoint
│   ├── layout.js                 # Root layout with fonts
│   ├── page.js                   # Main UI component
│   └── globals.css               # Global styles
└── .env.local                    # Environment variables
```

## 🎯 Usage

### Method 1: URL Import

1. Paste a Vigoshop.si product URL
2. Click "📥 Naloži" to auto-extract product data
3. Click "Generiraj 5 oglasov z Claude AI"

### Method 2: Quick Templates

1. Click one of the sample product buttons
2. Click "Generiraj 5 oglasov z Claude AI"

### Method 3: Manual Entry

1. Fill in the form fields:
    - Product name (required)
    - Price (required)
    - Key features (required)
    - Target audience (optional)
    - Pain point (optional)
    - Unique value (optional)
    - Tone of voice
2. Click "Generiraj 5 oglasov z Claude AI"

## 🎨 Ad Types Generated

1. **Problem-Solution**: Frames the product as solving a specific problem
2. **FOMO/Urgency**: Creates urgency with limited-time messaging
3. **Benefit-First**: Leads with the main benefit to the customer
4. **Social Proof**: Uses numbers and popularity to build trust
5. **Direct**: Straightforward feature-focused messaging

## 📏 Character Limits

The generator enforces Facebook's ad specifications:

- **Headline**: 40 characters max
- **Body**: 125 characters max
- Color-coded validation (green → yellow → red)

## 🔌 API Endpoints

### POST `/api/generate`

Generates 5 ad variations based on product data.

**Request Body:**

```json
{
  "name": "Product Name",
  "price": "29,99€",
  "features": "Feature 1, Feature 2, Feature 3",
  "targetAudience": "Target audience description",
  "painPoint": "Problem it solves",
  "uniqueValue": "Unique selling point",
  "tone": "friendly"
}
```

**Response:**

```json
{
  "success": true,
  "ads": [
    {
      "type": "Problem-Rešitev",
      "headline": "Short punchy headline",
      "body": "Persuasive body text",
      "rationale": "Why this works",
      "cta": "Call to action"
    }
  ],
  "usage": {
    "inputTokens": 1234,
    "outputTokens": 567
  }
}
```

### POST `/api/scrape`

Extracts product data from Vigoshop.si URLs.

**Request Body:**

```json
{
  "url": "https://vigoshop.si/product/..."
}
```

**Response:**

```json
{
  "success": true,
  "product": {
    "name": "Product Name",
    "price": "29,99€",
    "features": "Feature 1, Feature 2",
    "targetAudience": "Suggested audience",
    "painPoint": "Problem identified",
    "uniqueValue": "Unique value proposition"
  }
}
```

## ⚙️ Configuration

### Tone of Voice Options

- **Friendly**: Warm, approachable, conversational
- **Professional**: Trustworthy, expert, formal
- **Urgent**: Energetic, action-oriented, time-sensitive
- **Playful**: Fun, lighthearted, slightly humorous

### Model Settings

Located in `/api/generate/route.js`:

```javascript
model: 'claude-sonnet-4-20250514'
max_tokens: 3000
temperature: 0.9  // Higher creativity
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add `ANTHROPIC_API_KEY` environment variable
4. Deploy

### Other Platforms

Ensure Node.js 18+ runtime and set the `ANTHROPIC_API_KEY` environment variable.

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Keep your Anthropic API key secure
- Consider implementing rate limiting for production
- Add authentication for production deployment

## 🐛 Troubleshooting

**"Error generating ads"**

- Verify your API key is correct
- Check you have API credits available
- Ensure all required fields are filled

**"Napaka pri pridobivanju podatkov"**

- Verify the URL is from vigoshop.si
- Check the product page is publicly accessible
- Ensure stable internet connection

