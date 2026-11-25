# Taqdeer House — Official Website

Live Shopping style online shop for **Taqdeer House** (clothing store, Bangladesh).

- 🛍️ **Storefront** — Live Shopping style: orange header, search, Track Your Order, cart,
  Shop by Categories, category sidebar/filter, Best Selling / Flash Sale, product grid.
- ⚙️ **Admin Panel** — same page, click **Admin Panel** (or open `index.html#admin`):
  Products (edit price / old price / stock / sizes / colours, add, hide, delete),
  Categories (create / rename / delete), Orders (newest first, status change, WhatsApp resend),
  Payment (COD / bKash / Nagad / Rocket on-off + numbers, delivery charges, WhatsApp number).
- 💬 **WhatsApp orders** — the customer first picks colour, size and quantity, then fills
  name, phone, address, delivery area and payment method. **Order Now** saves the order
  to Firebase, decrements stock (only when a price is set), and shows a confirmation
  panel with a WhatsApp button to **01690090084** (`wa.me/8801690090084`) carrying the
  fully formatted order text.
- 🔥 **Data** — all products, categories, settings and orders live in Firebase Realtime
  Database and are read/written through its public REST API (`.json` endpoints).
  The storefront refreshes every 5 seconds, so admin changes show up live.
  **No Firebase apiKey or secret is stored in this repo.**
- 💰 **Prices** — no prices are invented. Products with no price set show
  “দাম জানতে WhatsApp করুন” (ask the price on WhatsApp) until the admin sets a price.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Storefront + admin panel markup, modals (product, checkout, confirmation, track order, cart, edit) |
| `css/style.css` | All styling (Live Shopping look) |
| `js/app.js` | All logic: Firebase REST, storefront, cart, checkout, WhatsApp format, admin |
| `.nojekyll` | Tells GitHub Pages not to run Jekyll |

## Enable GitHub Pages (make the site live)

1. Open the repo on GitHub → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: **main**, Folder: **/ (root)** → **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/taqdeer-house-shop/`

## How Firebase works

- Database URL: `https://taqdeer-house-default-rtdb.firebaseio.com/`
- The Realtime Database rules are public read/write, so the browser talks to it
  directly with plain `fetch()` calls to `/products.json`, `/categories.json`,
  `/settings.json` and `/orders.json`.
- If the database is ever empty, the site seeds the 4 categories, 14 starter
  products and default settings on first load (prices stay unset).

## How admin works

1. Open the site and click **Admin Panel** (top-right), or add `#admin` to the URL.
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
