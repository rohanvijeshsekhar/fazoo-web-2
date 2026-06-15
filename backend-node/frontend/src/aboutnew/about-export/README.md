# FAAZO Dental Technologies - About Page Export

This package contains everything needed to migrate the **About** page of FAAZO Dental Technologies to another project.

## Directory Structure

```text
about-export/
├── About.jsx             # Main About page React component (with all internal sections)
├── package.json          # Dependencies required by this component
├── tailwind.config.js    # Theme configurations (brand colors and fonts) required for styling
├── images/               # Image assets used in the About page
│   ├── about_hero.png
│   └── timeline/
│       ├── im1.png
│       ├── im2.png
│       ├── im3.png
│       ├── im4.png
│       ├── im5.png
│       └── im6.png
└── README.md             # This migration guide
```

## Migration & Integration Steps

### 1. Install Dependencies
Run the following command in your target project to install the required dependencies:
```bash
npm install react react-dom gsap lucide-react
```

### 2. Copy the React Component
Copy `About.jsx` into your target components/pages directory.

### 3. Setup Image Assets
Move all files inside the `images/` directory into your project's public folder. 
By default, the image paths inside `About.jsx` expect the following structure:
- `/hero/about/about_hero.png`
- `/hero/about/timeline/im1.png`
- `/hero/about/timeline/im2.png`
- `/hero/about/timeline/im3.png`
- `/hero/about/timeline/im4.png`
- `/hero/about/timeline/im5.png`
- `/hero/about/timeline/im6.png`

Make sure the files are placed inside your public assets folder such that they are accessible at these exact root-relative paths, or update the references in `About.jsx` to point to your custom location.

### 4. Configure Tailwind CSS
The About page uses custom fonts and brand colors defined in the theme extension. Add the following extends to your target project's `tailwind.config.js` or copy the config file directly:

```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        faazo: {
          teal: '#006F7A',
          cyan: '#2EA5B0',
          navy: '#0B2530',
          gray: '#526F7A',
          light: '#F4F8F9',
          border: '#E1EDF0',
        }
      }
    },
  }
}
```

### 5. Add Google Fonts Links
To display the typography correctly, ensure that **Inter** and **Plus Jakarta Sans** are loaded in your HTML (`index.html` or equivalent):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```
