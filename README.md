<div align="center">

# HSR Stellar Jades Calculator

Lower-bound pulls estimation from today to end date for the hit game [Honkai: Star Rail](https://hsr.hoyoverse.com/)~

![Hero](docs/images/hero.png)

Built using [React](https://react.dev/) via [Vite](https://vite.dev/) on [Typescript](https://www.typescriptlang.org/), big help from [shadcn/ui](https://ui.shadcn.com/)!

[i18next](https://www.i18next.com/) for localisation, [Tailwind CSS](https://tailwindcss.com/) for theming (using own Theme Provider), and [Motion](https://motion.dev/) for animations

</div>

## Features

- Form steps to configure for all known sources of stellar jades and limited passes
- Customisable dynamic unlimited section to add all extra sources of jades and passes, mainly for events, gifts/redeemable code, compensation etc. And to be more future proof when website stops being maintained
- Responsive design (mobile-friendly) as priority
- Many themes (because why not?)
- Localisation
- Remembers last session (theme, language, unsubmitted form state)

## Showcase

Main form with form stepper to show form filling progress

<img src="docs/images/main_form.png" width="640">

Custom amount to add in form

<img src="docs/images/additional_sources.png" width="640">

Mobile-friendly UI (bottom sticky buttons and minimalist progress bar)

<img src="docs/images/mobile_ui.png" width="320">

Touch-friendly tooltip (since hovering tooltip doesn't work on touch devices)

<img src="docs/images/mobile_tooltip.png" width="320">

Detailed results with calculation steps

<img src="docs/images/results.png" width="640">

Reward table of the game, for the curious ones

<img src="docs/images/reward_table.png" width="640">

Supports multiple languages (remembers last set language)

<img src="docs/images/localisation.png" width="320">

Allows users to switch between themes (remembers last set theme)

<img src="docs/images/theme_selector.png" width="320">

Night Time theme

<img src="docs/images/main_form_nighttime.png" width="640">

Just my fav theme from my fav character <3

<img src="docs/images/main_form_m7pres.png" width="640">

## Running locally

First, run the development server with the command `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Tests

Run tests by `npm test`, unit tests are only for the brunt of the calculating functions.

## Contributing

Issues and suggestions are always welcome in Github Issues.

Currently not open to contributors.

## Coding notice

British English is preferred.

[Conventional commits](https://www.conventionalcommits.org/) is used to standardise commits.

## Credits

Inspired by this [HSR Free Stellar Jade Calculator](https://github.com/Kronman590/hsr-gem-calculator)

### Special thanks

- [@cinnakoko](https://github.com/cinnakoko) for theme inspiration and testing~

#### Translations

- English (`en`): [@jeffoxd](https://github.com/jeffoxd)
- Simplified Chinese (`zh-Hans`): [@jeffoxd](https://github.com/jeffoxd)
- Traditional Chinese (`zh-Hant`): [@jeffoxd](https://github.com/jeffoxd)

#### Theming

- Helped a lot by Brandon's [HSL picker](https://hslpicker.com/)

## License

GNU General Public License v3.0 or later

See [COPYING](COPYING) to see the full text.
