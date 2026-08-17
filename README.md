# Travlr Getaways

CS 465 Full Stack Development  
Kasra Pratt

Travlr Getaways is a full-stack travel site built for this course. It has two sides: a public website where people can browse trips, and an admin SPA where staff can log in and manage the trip catalog.

---

## Tech Stack

- **Public site:** Express + Handlebars
- **Admin SPA:** Angular
- **Backend:** Node.js / Express
- **Database:** MongoDB with Mongoose
- **Auth:** JSON Web Tokens (JWT)

---

## What It Does

**Customer side**
- Browse available trips
- See details like length, resort, price, and description
- Pages are rendered on the server with Handlebars

**Admin side**
- Login / register
- View all trips as cards
- Add new trips
- Edit existing ones
- Create and update routes are protected — you need a valid token

---

## How to Run It

You’ll need Node, MongoDB running locally, and the Angular CLI.

```bash
# install backend packages
npm install

# install the Angular app
cd travlr-admin
npm install
cd ..
```

Start the backend:
```bash
npm run start
```

In another terminal, start the admin app:
```bash
cd travlr-admin
ng serve
```

- Public site → http://localhost:3000  
- Admin SPA → http://localhost:4200

---

## Project Layout

```
travlr/
├── app_api/               # REST API (controllers, models, routes)
├── app_server/            # Public Express site + Handlebars views
├── travlr-admin/          # Angular SPA
│   └── src/app/
│       ├── services/      # TripData + Authentication
│       ├── models/
│       ├── trip-listing/
│       ├── trip-card/
│       ├── add-trip/
│       ├── edit-trip/
│       ├── login/
│       └── navbar/
└── public/                # static files
```

---

## API Endpoints

| Method | URL                     | Auth? | What it does              |
|--------|-------------------------|-------|---------------------------|
| GET    | /api/trips              | No    | List all trips            |
| GET    | /api/trips/:tripCode    | No    | Get one trip              |
| POST   | /api/trips              | Yes   | Create a trip             |
| PUT    | /api/trips/:tripCode    | Yes   | Update a trip             |
| POST   | /api/register           | No    | Create an admin account   |
| POST   | /api/login              | No    | Log in and get a JWT      |

Protected routes expect:  
`Authorization: Bearer <your-token>`

---

## Security Notes

Passwords are hashed with a salt (using Node’s crypto module) — nothing is stored in plain text. When you log in or register, the server sends back a JWT. The Angular app stores that token and sends it with any create/update request. There’s a `verifyToken` middleware on the backend that checks the token before allowing those operations.

---

## Reflection

### Architecture

This project used two different frontend approaches. The public site is built with Express and Handlebars. The server handles the request, pulls data from MongoDB, and renders the page with a template. It’s a traditional server-side rendering setup.

The admin side is an Angular single-page application. After the initial load, navigation and updates happen in the browser without full page reloads. Working with components, services, and client-side routing was a different experience from the Handlebars pages.

The backend uses MongoDB. Each trip is stored as a document with fields like code, name, length, start date, resort, price, image, and description. Mongoose was used for the schema and to interact with the database.

### Functionality

JSON is the format used to pass data between the frontend and backend. It’s not the same as JavaScript — it’s just structured data with no functions or methods. The Express API returns JSON, the Angular services read that JSON, and MongoDB stores the documents in a similar shape. That shared format is what connects the different parts of the application.

As the project moved through the modules, code was reorganized to keep things cleaner. HTTP calls were moved into services instead of living directly in components. The trip card was also pulled into its own component so the same layout could be reused on the listing page. That made the code easier to maintain as more features were added.

### Testing

Testing the public endpoints was mostly a matter of calling `/api/trips` and checking that an array came back, and calling a specific trip code to confirm it returned the right document or a 404. The protected endpoints required extra steps — logging in first to get a token, then including that token in the request headers. Without a valid token the server blocked the request. With a valid one, create and update worked as expected.

Adding security meant checking more cases: missing tokens, bad tokens, and whether the middleware was correctly reading the Authorization header. The Angular side also had to be checked to make sure it only sent protected requests after a successful login. The final test was a full round trip — log in through the SPA, edit a trip, then confirm the change showed up on the public site.

### Looking Back

This course took me further than earlier ones. I had worked with individual parts of the stack before, but this was the first time everything had to connect — public site, admin SPA, API, database, and authentication — into one working application. Getting the requests to flow correctly across all those layers was challenging at times, but it helped me understand how the pieces fit together.

The skills that stand out now are working with protected API routes, using Angular services, handling JWT authentication, and moving between server-rendered pages and a client-side SPA. Having a finished project like this also helps for a portfolio — it shows I can follow a full set of requirements and produce a working full-stack application.
