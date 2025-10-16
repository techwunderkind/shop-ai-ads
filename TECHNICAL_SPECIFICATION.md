
# 🔧 **Technical Specification – Vigoshop AI Ad Generator**

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Claude AI](https://img.shields.io/badge/Claude-AI-FF6B35?style=for-the-badge&logo=anthropic)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

</div>

---

## 📋 **1. Overview**

The **Vigoshop AI Ad Generator** is a **Next.js 14 web application** that generates optimized Facebook ad copies in Slovenian using **Anthropic Claude AI**.  
It consists of a **frontend interface** for users and several **API routes** that handle authentication, product data extraction, and AI text generation.

---

## 🏗️ **2. System Architecture**

```mermaid
graph TD
    A[User Browser UI] --> B[Next.js API Routes]
    B --> C[Anthropic Claude API SDK]
    
    A --> A1[React Components]
    A --> A2[Tailwind CSS UI]
    
    B --> B1[/api/auth - login]
    B --> B2[/api/scrape - data load]
    B --> B3[/api/generate - AI ads]
    
    C --> C1[claude-sonnet-4 model]
```

### 🛠️ **Frameworks and Libraries:**
- **Next.js 14** (App Router)
- **React 18**
- **TailwindCSS** for styling  
- **Anthropic SDK** (`@anthropic-ai/sdk`) for AI integration
- **NextResponse (Edge API Routes)** for secure backend endpoints

---

## 📁 **3. Folder Structure**

```
📦 /app
├── 📄 layout.js                # Global layout and font configuration
├── 📄 page.js                  # Main generator UI
├── 📄 login/page.js            # Login screen
├── 📁 api
│   ├── 📄 auth/route.js       # Authentication logic (login/logout)
│   ├── 📄 scrape/route.js     # Product data scraper (Claude-powered)
│   └── 📄 generate/route.js   # AI ad text generator
📁 /public
└── 📄 ...                      # Static assets
```

---

## 🔐 **4. Authentication**

### 🌐 **Endpoint: `/api/auth`**
- **Method:** `POST`
- **Purpose:** Validates user login credentials.
- **Environment variables required:**
  ```bash
  AUTH_USERNAME=<your_username>
  AUTH_PASSWORD=<your_password>
  ```
- **Flow:**
  1. Compares provided credentials with env variables.
  2. If valid, sets an **HTTP-only cookie (`auth`)** for 1 hour.
  3. Used by middleware or protected routes for session management.
- **Logout:**  
  `DELETE /api/auth` clears the authentication cookie.

---

## 🤖 **5. AI Ad Generation**

### 🌐 **Endpoint: `/api/generate`**
- **Method:** `POST`
- **Purpose:** Generates 5 ad copies using Claude AI.
- **Body Example:**
  ```json
  {
    "name": "Brezžična kamera DIGICAM",
    "price": "29,99€",
    "features": "Nočni vid, WiFi, Full HD",
    "targetAudience": "Starši, lastniki domov",
    "painPoint": "Skrb za varnost doma",
    "uniqueValue": "Vidiš dom v živo kadarkoli",
    "tone": "friendly"
  }
  ```
- **Response Example:**
  ```json
  {
    "success": true,
    "ads": [
      {
        "type": "Problem-Rešitev",
        "headline": "Otrok sam doma?",
        "body": "S kamero DIGICAM ga vidiš 24/7. Brez kablov!",
        "rationale": "Uporablja čustveni pristop in reši skrb.",
        "cta": "Poglej kako →"
      }
    ]
  }
  ```

- **AI Model:**  
  `claude-sonnet-4-20250514`  
- **Token Usage Logging:**  
  Each response includes:
  ```json
  "usage": { "inputTokens": 1234, "outputTokens": 456 }
  ```

---

## 🕷️ **6. Product Data Scraper**

### 🌐 **Endpoint: `/api/scrape`**
- **Method:** `POST`
- **Purpose:** Extracts product info from Vigoshop.si product page.
- **Body:**
  ```json
  { "url": "https://vigoshop.si/izdelek/ultrazvocni-cistilec-zob" }
  ```
- **Process:**
  1. Fetches the HTML content of the provided URL.
  2. Sends HTML to Claude AI for structured data extraction.
  3. Returns cleaned JSON:
     ```json
     {
       "name": "Ultrazvočni čistilec zob",
       "price": "24,99€",
       "features": "3 nastavki, USB polnjenje, tiho delovanje",
       "targetAudience": "Odrasli, ki skrbijo za zobe",
       "painPoint": "Draga zobna higiena pri zobozdravniku",
       "uniqueValue": "Profesionalno čiščenje doma za 1/10 cene"
     }
     ```
- **Limitations:**
  - Only supports URLs containing `vigoshop.si`.
  - Claude model limited to analyzing first ~15,000 characters of HTML.

---

## 🎨 **7. Frontend Components**

### 📄 **`page.js`**
- Main React page that handles:
  - Product data input (manual or from URL)
  - Tone selection
  - AI generation button and loading states
  - Error handling and validation
  - Display and export of generated ads
  - Character limit coloring logic
- Built with responsive **Tailwind utility classes** and glassmorphism effects.

### 📄 **`layout.js`**
- Sets global layout and Google Fonts (Geist Sans and Mono)
- Defines metadata:
  ```js
  export const metadata = {
      title: "Vigoshop AI Ad Generator",
      description: "Generate professional Facebook ads with Claude AI"
  }
  ```

### 📄 **`login/page.js`**
- Simple login interface with gradient background and secure form.
- On success, refreshes to `/` to trigger middleware authentication.

---

## ⚙️ **8. Environment Variables**

| 🔧 Variable | 📝 Description | ✅ Required |
|-------------|----------------|-------------|
| `ANTHROPIC_API_KEY` | Claude API key | ✅ |
| `AUTH_USERNAME` | Login username | ✅ |
| `AUTH_PASSWORD` | Login password | ✅ |
| `NODE_ENV` | Set to `production` for secure cookies | ⚙️ Optional |

---

## 🚀 **9. Deployment**

### 🏗️ **Recommended Stack:**
- **Hosting:** Vercel / AWS Amplify / Docker
- **Runtime:** Node.js 18+
- **Build Command:**  
  ```bash
  npm install
  npm run build
  npm start
  ```
- **Environment Setup:**  
  Define all `.env` variables in deployment environment.

### 📝 **Notes:**
- Ensure secure storage of the Claude API key.  
- Enable HTTPS (cookie requires secure flag in production).  
- Use CDN caching for static assets.

---

## 🚨 **10. Error Handling**

| ❌ Type | 💬 Example Message | 🔍 Cause |
|---------|-------------------|----------|
| Validation | "Ime izdelka, cena in funkcije so obvezni" | Missing input fields |
| Claude Parsing | "Unexpected token …" | AI response malformed JSON |
| Network | "Napaka pri povezavi" | Timeout or fetch error |
| Auth | "Napačno uporabniško ime ali geslo" | Invalid credentials |
| Config | "AUTH_USERNAME not set" | Missing environment variable |

---

<div align="center">

**Built with ❤️ for Vigoshop Development Team**

</div>
