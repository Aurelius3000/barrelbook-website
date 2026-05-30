# Add New App Store Reviews Sprint Prompt

Add two user-supplied App Store reviews to the homepage review grid.

## Review Copy

### This app makes my hobby more organized.
- Author: `Cewj2000`
- Date: `May 19`
- Text: `This app has made my bottle tracking so much easier. I hated going to a store and not being sure if I already had a bottle or not. Now with BarrelBook I can simply open the app and compare my collection to what is available on the shelves. I do also love that I can share my collection with my friends. It makes bottle shares so much more fun as we can look at what is potentially available to share.`

### Great app so far
- Author: `BigJ71141`
- Date: `May 18`
- Text: `Love it so far, I’d been looking for a way to keep track of my bottles other than making a spreadsheet and came across this. Only suggestion so far is that it would be awesome if the “spin to pick a pour” filters had an option for open bottles vs. unopened bottles. I try to keep my open bottles to a minimum but sometimes want to open one I haven’t tried yet.`

## Constraints

- Keep the existing review card layout.
- Keep the five-star visual.
- Do not redesign the reviews section.
- Do not alter App Store rating hero copy, pricing, or CTAs.

## Verification Commands

```bash
npm run build
rg "This app makes my hobby more organized|Great app so far|Cewj2000|BigJ71141" .next src
```
