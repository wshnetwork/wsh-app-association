// ---------------------------------------------------------------
// stages.js
// Pure config. Add, remove, or reorder entries here — phone.js reads
// this array and does the rest. Nothing else needs to change.
//
// Each stage:
//   section:     the id="" of the real page section this stage applies to
//   position:    'left' | 'center' | 'right' - where the phone sits
//                horizontally while this section is active
//   images:      array of screenshot URLs available for this stage
//   activeImage: index into `images` for the one currently shown
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
    images: ['../assets/img/welcome.jpeg'],
    activeImage: 0,
  },
  {
    section: 'solution',
    position: 'left',
    images: [
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663113433742/wzfwSKxqzdADZfyq.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663113433742/YhDOooprYbcGhkst.png',
    ],
    activeImage: 0,
  },
  {
    section: 'identity',
    position: 'right',
    images: [
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663113433742/UKdLkEgjWbnTQcCK.png',
    ],
    activeImage: 0,
  },
  {
    section: 'value',
    position: 'left',
    images: ['../assets/img/welcome.jpeg'],
    activeImage: 0,
  },
  {
    section: 'independence',
    position: 'center',
    images: ['../assets/img/welcome.jpeg'],
    activeImage: 0,
  },
];