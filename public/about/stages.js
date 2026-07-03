// ---------------------------------------------------------------
// stages.js
// Pure config. Add, remove, or reorder entries here — phone.js reads
// this array and does the rest. Nothing else needs to change.
//
// Each stage:
//   section:         the id="" of the real page section this stage applies to
//   position:        'left' | 'center' | 'right' - where the phone sits
//                    horizontally while this section is active
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
    position: 'right',
    images: ['../assets/img/screenshots/welcome.jpeg'],
    activeImage: 0,
    imageTransition: 'fade',
    tilt: 0
  },
  {
    section: 'solution',
    position: 'right',
    images: [
      '../assets/img/screenshots/feed.jpg'
    ],
    activeImage: 0,
    imageTransition: 'slideLeft',
    tilt: -10,
    scale: 1.2
},
{
    section: 'identity',
    position: 'left',
    images: [
        '../assets/img/screenshots/horse.png'
    ],
    activeImage: 0,
    imageTransition: 'popUp',
    tilt: 5,
  },

  {
    section: 'categories',
    position: 'left',
    images: ['../assets/img/screenshots/feed.jpg'],
    activeImage: 0,
    imageTransition: 'popDown',
    tilt: 5
  },
  {
    section: 'moderation',
    position: 'left',
    images: ['../assets/img/screenshots/welcome.jpeg'],
    activeImage: 0,
    imageTransition: 'fade',
  },
  {
    section: 'value',
    position: 'left',
    images: ['../assets/img/screenshots/horse.png'],
    activeImage: 0,
    imageTransition: 'fade',
  },
  {
    section: 'independence',
    position: 'center',
    images: ['../assets/img/screenshots/welcome.jpeg'],
    activeImage: 0,
    imageTransition: 'fade',
  },
];