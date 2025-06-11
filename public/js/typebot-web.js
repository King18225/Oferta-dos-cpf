
// This file is no longer used as the Typebot integration has been replaced
// by a simulated chat flow component (SimulatedChatFlow.tsx).
// You can safely remove this file if you are not planning to revert to
// using a local Typebot script.

// If you DO want to use this file for a local Typebot script in the future:
// 1. Paste the entire content of your Typebot web script here.
//    (e.g., from https://cdn.jsdelivr.net/npm/@typebot.io/js@0.3.59/dist/web.js)
//
// 2. CRITICAL: If the script is an ES Module (which it likely is if copied from the CDN),
//    it will EXPORT the Typebot object/class but NOT assign it to the global `window` object.
//    To make it work with the old `src/app/chat/page.tsx` logic (that looked for `window.Typebot`),
//    you would need to find the main Typebot object/class in the script (let's assume its name is `TypebotMainObject`)
//    and add this line AT THE VERY END of this file:
//
//    window.Typebot = TypebotMainObject;
//
//    Replace `TypebotMainObject` with the actual name of the main exported class/object from the script.
//    If the script uses `export { Typebot as Typebot }` or `export default Typebot`, then you would add:
//    window.Typebot = Typebot; // (assuming 'Typebot' is the exported name)
//
// 3. Ensure `src/app/chat/page.tsx` is configured to load this script and use `window.Typebot`.
//    (The current version of `src/app/chat/page.tsx` uses SimulatedChatFlow instead).
