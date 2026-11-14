# Product-story direction

Updated 14 November 2026.

The user asked for Folk's centered message-to-phone progression, Hey Clicky's glossy desktop-era button treatment, scroll storytelling, and a left-to-right metallic light sweep on “muscles are.” The existing Moltivate fonts, pine/orange palette, real imagery, and honest demo labels are retained.

## Decisions

- Let the complete headline and CTA be readable immediately. The product follows below, with the sponsor-track strip near the opening.
- Make motion explain the actual three-part flow: crew, workout, result. The phone remains interactive throughout; manual actions take precedence over scrolling.
- Give the pinned phone three viewport heights of scroll travel. Crew holds for 30%, workout for 42%, and result for 28%; the active chapter's progress tick fills as the reader scrolls. Native wheel/touch input stays untouched, so readers can still skip or reverse the story.
- Hand attention from the leaderboard to the phone: the edge card folds, lifts, slides right, and fades as the phone approaches its resting position. Scroll-up reverses that movement. An open drawer or keyboard-focused opener stays stable; system reduced motion uses simple visibility without the fold.
- Use a subtle CSS perspective phone with reflected light, paired with a paper commitment note. Keep the interface flat when it is being used. Avoid loading a 3D engine for a single device.
- Use the metallic gradient as a material effect on the requested words, and the glass gradient only on the primary CTA. Keep the rest of the page's established materials and hierarchy.
- Reveal supporting Polaroids/chat once, without delaying text. Run motion automatically and honor system reduced-motion preferences; the user requested removal of page animation switches. Short and mobile screens use normal page flow.
- Avoid adding invented social proof, generic feature-card grids, ambient gradient blobs, cursor trails, or animations unrelated to the product. Visual conventions alone cannot reliably identify how a site was authored.

## Research

- [Anthropic's frontend-design guidance](https://www.anthropic.com/engineering/harness-design-long-running-apps) discusses recurring template aesthetics and evaluates originality, coherence, craft, and functionality. Applied here by grounding the motion in Moltivate's real demo and existing visual identity.
- [Nielsen Norman Group: Scroll-Triggered Text Animations Delay Users](https://www.nngroup.com/articles/scroll-animations/) recommends secondary-content motion, restraint, and one-time reveals. Body copy is never gated behind animation.
- [W3C: Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) describes disabling nonessential interaction-triggered movement. System preferences cover the decorative layer; the page has no animation settings UI.
- [Interrogating Design Homogenization in Web Vibe Coding](https://arxiv.org/abs/2603.13036) analyzes convergence toward familiar patterns. These are design risks, not a reliable authorship detector.

## Checks

The browser suite covers vertical headline/phone order and centering, the coming-soon CTA, reduced-motion behavior, scroll chapter transitions, reading space across ordinary wheel gestures, dialog survival during scrolling, explicit resumption, and automatic motion without on-page switches. The leaderboard drawer adds keyboard, navigation, responsive, shared-feed, and reversible scroll-handoff checks. Existing tests cover the full demo loop, leaderboard, local assets, and narrow-screen overflow.
