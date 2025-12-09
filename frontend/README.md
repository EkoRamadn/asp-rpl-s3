# ARDEN FRONTEND

## Getting Started

First, run the development server:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Architecture Folder

follow the guide Next Project

```
├── public
|   ├── data/*
|   └── assets
|       ├── image/*
|       └── icon/*
|
├── package.json
├── package-lock.json
├── README.md
└── src
    ├── app
    |   ├── {pages}
    |   |    └── page.tsx
    |   ├── global.css
    |   ├── loading.tsx
    |   ├── not-found.tsx
    |   ├── page.tsx
    |   └── favicon.ico
    |
    ├── components
    |   ├── ui
    |   |   └── {more component library}
    |   |
    |   ├── custom
    |   |   └── {nameComponent}
    |   |        ├── {name}Iu.tsx
    |   |        └── logic
    |   |            └── {name}Logic.ts/tsx
    |   |
    |   ├── layout
    |   |   └── {name}Layout.tsx
    |   |
    |   └── widget
    |       └── {name}Widget.tsx
    |
    ├── hooks
    |   └── use{Name}Hook.ts/tsx
    |
    ├── lib
    |   ├── constants.ts
    |   └── auth.ts
    └── model/*
```

View
[Ked Architecture](https://github.com/exclnt/cheat-sheet-education/blob/main/architecture/next.md)

### Note

> Pastikan Menerapkan Git Flow setiap Perubahan komponen (ikuti intruksi [CONTIBUTING](../CONTRIBUTING.md)).

> Fokus Selesaikan komponen yang dikerjakan sebelum mengerjakan Komponen Lain.

> Jangan install Depedensi Baru Sebelum sebelum Konfirmasi.
