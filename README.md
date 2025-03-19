# HSR Stellar Jades Calculator

Lower bound estimation of stellar jades and limited passes from today to end date.

Built using [React](https://react.dev/) via [Next js](https://nextjs.org/) on [Typescript](https://www.typescriptlang.org/), big help from [shadcn/ui](https://ui.shadcn.com/)!

## Features

- Several configurations for all known sources of stellar jades and limited passes
- Customisable dynamic unlimited section to add all extra sources of jades and passes, mainly for events, gifts/redeemable code, compensation etc. And to be more future proof when website stops being maintained
- Many themes (because why not?)
- Mobile-friendly

## Rewards amount

Wondering about the jades/passes reward table? Check [constants.ts](/src/lib/constants.ts), it's pretty self-explanatory.

## Running locally

First, run the development server with the command `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Tests

Run tests by `npm test`, unit tests are only for the brunt of the calculating functions.

## Contributing

Issues and suggestions are always welcome in Github issues.

Currently not open to contributors.

## Coding notice

British English is preferred.

[Conventional commits](https://www.conventionalcommits.org/) is used to standardise commits.

## Why Next.js

Ah yes, perhaps you realised I'm using Nextjs for an exclusively SPA project, it was a mistake I made at the start and wasn't worth the effort to change it to something else... yet. Maybe in the future~

## License

GNU General Public License v3.0 or later

See [COPYING](COPYING) to see the full text.
