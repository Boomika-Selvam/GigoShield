# ⬡ GigoShield  
### AI-Powered Parametric Insurance for India's Gig Economy  

> **"We don't ask if the weather was bad. We already know. We just pay."**

---

## 📌 The Problem

India has 50+ million gig economy delivery workers on platforms like Zomato, Swiggy, Zepto, Blinkit, Amazon, and Dunzo. They are the backbone of urban commerce — but they are completely unprotected.

When a cyclone hits Chennai or a heatwave locks down Delhi, a delivery rider loses their entire week's income overnight. Traditional insurance fails them because:

- Claims require paperwork, photos, and agent visits  
- Approvals take days or weeks  
- Premiums are unaffordable for daily-wage workers  
- Fraud detection is manual and ineffective  
- No product exists specifically for weather-triggered income loss  

**GigoShield solves this with parametric insurance.** The moment rain crosses 10mm/h, the system detects it, verifies the worker, calculates income loss, and sends money to their UPI — in under 5 seconds, with zero paperwork.

---

## 💡 What is Parametric Insurance?

Unlike traditional insurance where you must prove your loss, parametric insurance pays automatically when a pre-agreed condition is met.

**Traditional:**  
Event → Worker files claim → Agent reviews → 2 weeks → Maybe paid  

**Parametric:**  
Event → Threshold crossed → Auto-verified → < 5 seconds → Paid  

GigoShield uses live weather data to make the process **objective, instant, and tamper-proof**.

---
  
## 🚀 Live Demo
Vedio Link : https://drive.google.com/file/d/15tGWtmAczwtC73cnQGrnwTwCElTTbDNB/view?usp=sharing

### ▶️ Run Locally

```bash
unzip gigoshield_multifile.zip
cd gigoshield

# Python (Mac / Linux / Windows)
python -m http.server 8000

# OR Node.js
npx serve .
```

Open: http://localhost:8000  

**Note:** Browsers block `file://` (CORS). A simple server solves it.  
- No API key needed for weather  
- Gemini AI is optional  

---

## ✨ Features

### ⚡ Parametric Trigger Engine

| Trigger            | Threshold     | Data Source       |
|-------------------|--------------|------------------|
| Heavy Rainfall    | > 10 mm/h    | Open-Meteo Live  |
| Extreme Heat      | > 40°C       | Open-Meteo Live  |
| High Winds        | > 60 km/h    | Open-Meteo Live  |
| Severe AQI        | > 300 AQI    | WAQI API         |
| Government Curfew | Official     | News API         |
| Platform Outage   | > 1 hour     | Platform Webhook |

---

### 🧠 AI Trust Score Engine

```
Trust Score = 
0.30 × Movement Consistency
+ 0.30 × Activity Score
+ 0.20 × Peer Match
+ 0.20 × Claim History
```

| Score Range | Decision                 | Payout                       |
|-------------|--------------------------|------------------------------|
| ≥ 0.80      | ✅ Instant Full Payout  | UPI transfer in < 5 seconds   |
| 0.50 – 0.79 | ⏳ Partial + 24h Review | 60% now, rest after re-verify |
| < 0.50      | 🔍 Human Review         | 48h SLA, appeal available     |

---

### 🛡️ Anti-Fraud Defense System

| Signal            | What It Checks            | How Spoofers Fail        |
|-------------------|---------------------------|--------------------------|
| GPS Road Snap     | GPS → OSM road validation | Lands in buildings/water |
| Accelerometer     | Physical vibration        | Flat signal              |
| IP Subnet Cluster | Network clustering        | Fraud rings              |
| Claim Timing      | Mass claims               | Coordinated attack       |
| Order Activity    | Platform orders           | No proof of work         |
| Device Fingerprint| Hardware + SIM            | Device reuse             |
| Cell Tower Match  | Network vs GPS            | Location mismatch        |
| Speed Entropy     | Velocity variation        | Constant speed           |
| Peer Density      | Nearby workers            | No real peers            |

---

### 🌦️ Live Weather Intelligence

- Real-time data for 7 major Indian cities  
- Temperature, precipitation, wind, humidity  
- 3-day forecast with rain probability  
- Auto-refresh every 5 minutes  
- India risk map visualization  
- 100% free (Open-Meteo)  

---

### 📋 End-to-End Claim Simulator

1. Trigger received  
2. Trust score computed  
3. Fraud analysis  
4. Payout calculated  
5. UPI generated  

Test scenarios:
- Genuine Worker  
- Network Drop  
- GPS Spoof  

---

### ✨ Gemini AI Assistant (Optional)

- Live weather + claim context  
- Premium suggestions  
- Risk insights  

---

### 📊 Platform Analytics

- Weekly premium vs payout charts  
- City-wise claims distribution  
- Trust score distribution  
- Claim status breakdown  
- Risk heatmaps  
- Revenue projection  

---

### 🗺️ Worker Onboarding

1. Profile  
2. Coverage  
3. Policy  

---

### ⚙️ Admin Panel

- Configure triggers  
- Monitor liquidity pool  
- Manage workers  
- System health  
- API key management  

---

## 💰 Premium Model

```
Basic Premium = ₹50 + RiskScore
Pro Premium   = Basic × 1.4
Zone Discount = −₹2 to −₹5
```

| Risk Level     | Basic Plan     | Pro Plan       |
|----------------|----------------|----------------|
| Low (0–30)     | ₹50–₹80/week   | ₹70–₹112/week  |
| Medium (31–60) | ₹81–₹110/week  | ₹113–₹154/week |
| High (61–100)  | ₹111–₹150/week | ₹155–₹210/week |

**Risk Formula:**
```
Risk = Zone Base + Platform Modifier + Experience Modifier
```

---

## ⚠️ The Fraud Challenge

**Threat:**  
Large-scale GPS spoofing syndicates triggering false payouts.

**Solution:**  
Behavior-based validation instead of location-only checks.

**Genuine Worker Signals:**
- Real movement (3–25 km/h)  
- Accelerometer vibration  
- Recent orders  
- Matching cell tower  
- Variable speed  

---

## 📁 Project Structure

```
gigoshield/
├── index.html
├── src/
│   ├── app.js
│   ├── store/
│   ├── services/
│   ├── pages/
│   └── styles/
```

---

## 🛠️ Technology Stack

| Layer    | Technology   |
|----------|--------------|
| Frontend | Vanilla JS   |
| Routing  | Custom SPA   |
| Charts   | Chart.js     |
| Weather  | Open-Meteo   |
| AI       | Gemini Flash |
| Styling  | CSS          |

---

## 🗺️ Phase Roadmap

### ✅ Phase 1 — Complete
- Weather integration  
- Trust scoring  
- Claim simulation  
- Fraud detection  
- Analytics dashboard  

### 🔄 Phase 2 — In Progress
- FastAPI backend  
- KYC authentication  
- Razorpay payouts  
- Webhooks  

### 🎯 Phase 3 — Planned
- XGBoost prediction  
- Isolation Forest fraud detection  
- Mobile app  
- Demo video  

---

## 📊 Financial Model

| Metric              | Value     |
|---------------------|-----------|
| Active Workers      | 1,247     |
| Weekly Premium Pool | ₹1,09,132 |
| Monthly Revenue     | ₹4,72,571 |
| Monthly Payouts     | ₹2,87,346 |
| Loss Ratio          | 60.8%     |
| Liquidity Reserve   | ₹50,00,000|

---

## 🔌 API Reference

### Open-Meteo
```
GET https://api.open-meteo.com/v1/forecast
```

### Gemini Flash
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
```

---

## 🌍 Cities Covered

| City      | Risk |
|-----------|------|
| Mumbai    | 82   |
| Delhi NCR | 75   |
| Bengaluru | 68   |
| Chennai   | 85   |
| Hyderabad | 78   |
| Kolkata   | 80   |
| Pune      | 72   |

---

## 🧠 Key Design Decisions

- No React → zero setup  
- Open-Meteo → free & reliable  
- Simulated inputs → better demo clarity  
- Parametric → instant payouts  

---

> **"Our system does not trust location alone — it trusts behavior, consistency, and collective intelligence."**
