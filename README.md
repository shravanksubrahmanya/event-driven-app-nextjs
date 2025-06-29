# 📝 Todo App with Event-Based Authentication

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), demonstrating **event-based authentication** using **Clerk Webhooks**.

---

## 🚀 Getting Started

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✨ Features

- 🧾 **Todo Management** with Create, Read, Update, and Delete operations.
- 🔐 **Authentication via Clerk**, with custom-built **Sign In** and **Sign Up** pages.
- 🔁 **Event-based User Sync**: When a user signs up, Clerk triggers a **Webhook**, which registers the user into the **PostgreSQL** database using **Prisma ORM**.
- 📦 **Database Layer** using [Prisma ORM](https://www.prisma.io/) with PostgreSQL.
- 🎨 Built using [shadcn/ui](https://ui.shadcn.com/) for elegant and customizable UI components.
- 🖋️ Font optimized using [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) with [Geist](https://vercel.com/font).

---

## 🔧 Stack

- **Framework**: Next.js 13+ App Router
- **Authentication**: Clerk (with Webhooks)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **UI**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React

---

## 🔐 Clerk Integration (Event-Based Auth)

- On user sign-up, Clerk triggers a webhook event `user.created`.
- A server route listens for this webhook, verifies it using `svix`, and creates a corresponding user record in the database.
- Example webhook handler: [`app/api/webhooks/route.ts`](./app/api/webhooks/route.ts)

---

## 🖥️ Custom Authentication Pages

- `app/sign-in/page.tsx`: Custom sign-in page with error handling and password toggle.
- `app/sign-up/page.tsx`: Custom sign-up page with email verification and password toggle.

---

## 🧪 Example Dashboard Usage

After logging in, users are redirected to `/dashboard`, where they can:

- View todos
- Search and paginate todos
- Add, edit, or delete todos

---

## 🛠️ Prisma ORM

Prisma is used to interact with the PostgreSQL database:

```bash
npx prisma generate     # Generate client
npx prisma migrate dev  # Run migrations
```

---

## 📦 Learn More

- [Clerk Docs](https://clerk.dev/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

---

## 🚀 Deployment

To deploy this application, we recommend [Vercel](https://vercel.com/), which seamlessly integrates with Next.js.

See: [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying)

---

## 📌 Note

This project is currently **in development**. More features and improvements are planned in the upcoming versions.
