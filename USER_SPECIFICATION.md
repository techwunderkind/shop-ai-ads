
# 🚀 **User Specification – Vigoshop AI Ad Generator**

<div align="center">

![AI Ad Generator](https://img.shields.io/badge/AI-Ad%20Generator-blue?style=for-the-badge&logo=openai)
![Slovenian](https://img.shields.io/badge/Language-Slovenian-green?style=for-the-badge)
![Facebook Ads](https://img.shields.io/badge/Platform-Facebook%20Ads-1877F2?style=for-the-badge&logo=facebook)

</div>

---

## 🎯 **Purpose**

The **Vigoshop AI Ad Generator** is a web-based tool that helps marketing teams quickly create high-performing **Facebook ad texts** in Slovenian using **Claude AI**.  
It automatically generates five ad versions per product, tailored to different marketing styles (problem-solving, FOMO, benefit-driven, etc.), and allows easy exporting for further use.

---

## 🔐 **Access and Login**

1. **Go to the provided web address** (e.g., `https://vigoshop-ai.company.com`).  
2. You'll see a **login screen** with fields for:
   - **Username**
   - **Password**
3. Enter your credentials and click **"Prijava"**.  
   - If the login is successful, you'll be redirected to the main app.
   - If you see an error, double-check your credentials or contact the system administrator.

---

## ⭐ **Main Features Overview**

After login, you'll access the **main generator interface**, where you can either:
- Load product data automatically from **Vigoshop.si**, or  
- Manually enter product details to generate custom ad texts.

---

### 🔄 **1. Load Product Automatically (Recommended)**

- Copy a **Vigoshop.si product URL** (e.g., `https://vigoshop.si/izdelek/...`).
- Paste it into the field labeled  
  **"Naloži podatke iz Vigoshop povezave"**.
- Click **"Naloži"** or press Enter.  
- The system will automatically extract:
  - Product name  
  - Price  
  - Key features  
  - Target audience (estimated)  
  - Pain point (problem it solves)  
  - Unique value proposition  
- All fields will be filled in automatically.

> ⚠️ **Note:** Currently, only **Vigoshop.si links** are supported.

---

### ✏️ **2. Manual Input**

If you want to create ads for other products:
1. Fill in the following fields manually:
   - **Ime izdelka** (Product Name) – e.g. *Brezžična kamera DIGICAM*  
   - **Cena** (Price) – e.g. *33,99€*  
   - **Ključne funkcije** (Key Features) – separate with commas  
     *e.g. Nočni vid, WiFi, Vodoodporna, Full HD*  
   - **Ciljna publika** – Who the ad is for  
   - **Težava, ki jo rešuje** – What problem the product solves  
   - **Edinstvena vrednost** – Why it's unique  
   - **Ton glasu** – Choose between:
     - Friendly & approachable  
     - Professional  
     - Urgent & action-driven  
     - Playful & fun  
2. Click **"Generiraj 5 oglasov z Claude AI"**.

---

### 🤖 **3. Generate AI Ads**

- The tool will create **five unique ad versions**:
  - Each includes a **headline**, **body**, **CTA (call to action)**, and **short rationale**.  
- You'll see all ads displayed in separate boxes.

Each ad style follows a different structure:

| 🎨 Type | 📝 Description |
|---------|----------------|
| **Problem-Rešitev** | Presents a customer problem and shows the solution. |
| **FOMO/Urgenca** | Focuses on urgency and limited-time offers. |
| **Korist-First** | Starts with the main benefit. |
| **Socialni dokaz** | Highlights trust and popularity. |
| **Neposredni/Direct** | Simple and fact-based approach. |

---

### 👀 **4. Review and Copy Ads**

- Each ad shows **character limits** for Facebook (Headline ≤ 40, Body ≤ 125).  
- Color indicators:
  - 🟢 **Green** – within limit  
  - 🟡 **Yellow** – near the limit  
  - 🔴 **Red** – too long  
- To copy an ad, click **📋** (copy icon).  
  - The text will be copied to your clipboard (ready for Meta Ads Manager).

---

### 📥 **5. Export Ads**

- Click **"📥 Izvozi vse"** to export all ads to a `.txt` file.  
- The file will contain all five ads with structure:
  ```text
  === OGLAS 1: Problem-Rešitev ===
  HEADLINE: ...
  BODY: ...
  CTA: ...
  ZAKAJ DELUJE: ...
  ```

---

### ⚡ **6. Quick Testing Option**

You can try the generator instantly using **sample products**:
- "Brezžična varnostna kamera"  
- "EMS Trebušni trener"  
- "Ultrazvočni čistilec zob"  
Click on a product name under **"Hitro testiranje"**, and the form will auto-fill.

---

## 🚨 **Error Messages and Troubleshooting**

| ❌ Message | 💡 Meaning | ✅ What to Do |
|------------|------------|---------------|
| *"Prosimo izpolnite vsaj ime izdelka, ceno in funkcije"* | Required fields missing | Fill in all mandatory fields. |
| *"Trenutno podpiramo samo Vigoshop.si povezave"* | Invalid URL | Use a product link from Vigoshop.si |
| *"Napaka pri povezavi"* | Network issue | Refresh or check internet connection. |
| *"Napačno uporabniško ime ali geslo"* | Login failed | Verify credentials or contact admin. |

---

## 🔒 **Security and Session**

- User sessions last **1 hour**.  
- After that, the app will automatically log out for security reasons.  
- To log out manually, close the browser or use the logout endpoint if provided.

---

## 🆘 **Support**

For help or feedback, contact the system administrator or the project owner.

---

<div align="center">

**Made with ❤️ for Vigoshop Marketing Team**

</div>
