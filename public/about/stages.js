// ---------------------------------------------------------------
// stages.js
// Pure config. Add, remove, or reorder entries here — phone.js reads
// this array and does the rest. Nothing else needs to change.
//
// Each stage:
//   section:         the id="" of the real page section this stage applies to
//   position:        number 1–100 (percentage of viewport width, 50 = center)
//                    or shorthand string: 'left' (30) | 'center' (50) | 'right' (70)
//   positionY:       number 1–100 (percentage of viewport height, 50 = center). Default: 50.
//   images:          array of screenshot URLs available for this stage
//   activeImage:     index into `images` for the one currently shown
//   scale:           size multiplier for the phone (default: 1). Interpolated between stages.
//   tilt:            Y-rotation in degrees (default: BASE_TILT in phone.js).
//                    0 = straight forward, -90 = sideways facing left, 90 = sideways facing right.
//                    Interpolated between stages.
//   imageTransition: how this stage's image transitions in from the previous one:
//                      'fade'      - crossfade (default)
//                      'scrollUp'  - next image slides up, pushing previous up
//                      'slideLeft' - next image slides in from the right side
//                      'popUp'     - next image slides up over the previous (previous stays still)
//                      'popDown'   - previous image slides down revealing the next (next stays still)
//
// Stages must be listed in the same top-to-bottom order as the
// sections appear on the page (phone.js also sorts them by actual
// position on load, so a slightly wrong order here won't break it,
// but keeping it matched is easiest to read).
// ---------------------------------------------------------------

const STAGES = [
  {
    section: 'problem',
    position: 70,
    images: ['../assets/img/screenshots/welcome.jpeg'],
    activeImage: 0,
    imageTransition: 'fade',
    tilt: 0
  },
  {
    section: 'solution',
    position: 80,
    images: [
      '../assets/img/screenshots/welcome2.PNG'
    ],
    activeImage: 0,
    imageTransition: 'slideLeft',
    tilt: -20,
    scale: 1.2
},
{
    section: 'identity',
    position: 30,
    images: [
        '../assets/img/screenshots/id-select.PNG',
    ],
    activeImage: 0,
    imageTransition: 'popUp',
    tilt: 5,
  },

  {
    section: 'categories',
    position: 50,
    positionY:-10,
    tilt: 0,
    scale: 1.2,
    images: [
        '../assets/img/screenshots/id-anon.png'
    ],
    activeImage: 0,
    imageTransition: 'fade',
  },
  {
    section: 'moderation',
    position: 30,
    images: ['../assets/img/screenshots/welcome.jpeg'],
    activeImage: 0,
    imageTransition: 'popDown',
  },
  {
    section: 'value',
    position: 70,
    images: ['../assets/img/screenshots/cat-advice.PNG'],
    activeImage: 0,
    imageTransition: 'fade',
    tilt: 0,
  },
  {
    section: 'independence',
    position: -50,
    images: ['../assets/img/screenshots/welcome.jpeg'],
    activeImage: 0,
    imageTransition: 'fade',
  },
];