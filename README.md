# 🧾 Appwrite Function: TaxJar Integration

This repository contains an [Appwrite Cloud Function](https://appwrite.io/docs/functions) designed to integrate with the [TaxJar API](https://developers.taxjar.com/api/). The function retrieves U.S. sales tax rates based on location and order details. It is deployed via GitHub through Appwrite’s built-in GitHub integration.

---

## 📦 Features

- 🔌 Integrates with the [TaxJar API](https://developers.taxjar.com/api/)
- 📡 Fetches accurate sales tax rates by ZIP code, city, state, or full order details
- 🚀 Automatically deployed to Appwrite Functions from this GitHub repo
- 📝 Built using Node.js (can be modified to support other runtimes)

---

## 🧰 Requirements

- Appwrite Project and self-hosted or cloud Appwrite instance
- A Function created in Appwrite with GitHub deployment enabled
- GitHub repository with this code
- [TaxJar API Token](https://developers.taxjar.com/api/reference/#authentication)
- Node.js 18+ (if running locally for testing)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/winnguyen1905/sencha-taxjar-function.git
cd appwrite-taxjar-function
