# Taqdeer House — Official Website

Live Shopping style online shop for **Taqdeer House** (clothing store, Bangladesh).

Two separate pages:

- 🛍️ **Storefront** — `index.html` — Live Shopping style: orange header, search,
  Track Your Order, cart, Shop by Categories, category sidebar/filter, Best Selling /
  Flash Sale, product grid. Customers pick colour, size and quantity, then fill
  name, phone, address, delivery area and payment method. **Order Now** saves the
  order to Firebase, decrements stock (only when a price is set), and shows a
  confirmation panel with a WhatsApp button to **01690090084**
  (`wa.me/8801690090084`) carrying the fully formatted order text.
  A small **Admin** link in the footer points to `admin.html`.
- ⚙️ **Admin Panel** — `admin.html` — Products (edit price / old price / stock /
  sizes / colours, add, hide, delete), Categories (create / rename / delete),
  Orders (newest first, status change, WhatsApp resend), Payment (COD / bKash /
  Nagad / Rocket on-off + numbers, delivery charges, WhatsApp number).

## 🔐 Admin PIN

`admin.html` opens with a PIN screen — the panel stays locked until the correct
PIN is entered. The PIN unlocks the panel for that browser session only (closing
the tab locks it again).

- **Initial PIN: `1234`.** It is stored in Firebase settings as `adminPin`
  (default `1234` when unset).
- **Change the PIN:** inside Admin → **Payment** tab → **“Admin PIN বদলান”** —
  enter the current PIN and the new PIN (4–6 digits). The PIN is never displayed
  on screen. If the PIN is forgotten, check Firebase Console → Realtime Database
  → `settings` → `adminPin`.
- **No other credential is printed here** — there is no password or API key in
  this repo. Firebase is used through its public REST API only.

## 🔥 Data

All products, categories, settings and orders live in Firebase Realtime
Database and are read/written through its public REST API (`.json` endpoints).
Both pages refresh every 5 seconds, so admin changes show up live on the shop.
**No Firebase apiKey or secret is stored in this repo.**

💰 **Prices** — no prices are invented. Products with no price set show
“দাম জানতে WhatsApp করুন” (ask the price on WhatsApp) until the admin sets a price.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Storefront only — product grid, modals (product, checkout, confirmation, track order, cart) |
| `admin.html` | Admin panel only — PIN gate + Products / Categories / Orders / Payment tabs, edit modal |
| `css/style.css` | All styling (Live Shopping look + PIN gate) |
| `js/common.js` | Shared: Firebase REST, seed data (14 products, 4 categories), WhatsApp order text, modals |
| `js/store.js` | Storefront logic only: grid, filters, cart, checkout, track order |
| `js/admin.js` | Admin logic only: PIN gate + PIN change, products, categories, orders, payment |
| `js/app.js` | Deprecated stub — the old combined script, kept only so old links don't 404 |
| `.nojekyll` | Tells GitHub Pages not to run Jekyll |

## Enable GitHub Pages (make the site live)

1. Open the repo on GitHub → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: **main**, Folder: **/ (root)** → **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/taqdeer-house-shop/`
   and the admin panel at `https://<your-username>.github.io/taqdeer-house-shop/admin.html`

## How Firebase works

- Database URL: `https://taqdeer-house-default-rtdb.firebaseio.com/`
- The Realtime Database rules are public read/write, so the browser talks to it
  directly with plain `fetch()` calls to `/products.json`, `/categories.json`,
  `/settings.json` and `/orders.json`.
- If the database is ever empty, the site seeds the 4 categories, 14 starter
  products and default settings on first load (prices stay unset).

## How admin works

1. Open `admin.html` and enter the Admin PIN (initially `1234`).
2. **Products** — click **Edit** to set price, old price, stock, sizes, colours,
   description, Best Selling / Flash Sale flags, or hide a product. Use the
   price/stock boxes in the table for quick edits. **＋ নতুন প্রোডাক্ট** adds one.
3. **Categories** — add a new category, rename one (products using it are updated
   automatically), or delete one. A category with products cannot be deleted.
4. **Orders** — every confirmed order appears newest-first. Change its status
   (Pending → Confirmed → Delivered / Cancelled); cancelling restores the stock.
   **WhatsApp এ পাঠান** resends the formatted order to 01690090084.
5. **Payment** — turn COD / bKash / Nagad / Rocket on or off, set their numbers,
   delivery charges (Inside Dhaka ৳60 / Outside Dhaka ৳120 by default) and the
   WhatsApp number. Only enabled payment methods appear at checkout.
6. **Admin PIN** — in the Payment tab, **“Admin PIN বদলান”** changes the PIN.
   Use **🔒 লক করুন** (top-right) to lock the panel again.
