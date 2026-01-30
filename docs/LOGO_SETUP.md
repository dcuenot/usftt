# USFTT Logo Setup Instructions

## Logo Location on Current Website

The USFTT logo is available on the main website at:
- **Main logo:** http://usftt.org/local/cache-vignettes/L150xH130/siteon0-7a790.jpg
- **Hover state:** http://usftt.org/local/cache-vignettes/L150xH130/siteoff0-242fe.jpg
- **Dimensions:** 150x130 pixels

## Manual Download Steps

1. Visit http://usftt.org/
2. Right-click on the USFTT logo in the header
3. Select "Save Image As..."
4. Save the file to: `frontend/public/usftt-logo.jpg`

## Recommended Logo Formats

For optimal performance and quality, consider creating these variants:

### Primary Logo (Required)
- **File:** `frontend/public/logo/usftt-logo.svg` (preferred) or `.png`
- **Format:** SVG for scalability, or high-res PNG
- **Size:** 150x130px minimum, vector preferred
- **Usage:** Navbar, header, mobile navigation

### Logo Variants (Optional)
1. **Square/Icon version**
   - File: `frontend/public/logo/usftt-icon.svg`
   - Size: 128x128px
   - Usage: PWA icon, favicon

2. **Wide version**
   - File: `frontend/public/logo/usftt-wide.svg`
   - Size: 300x100px
   - Usage: Large headers, desktop nav

3. **White version** (for dark backgrounds)
   - File: `frontend/public/logo/usftt-logo-white.svg`
   - Usage: Dark mode, colored backgrounds

## Asset Organization

```
frontend/public/
├── logo/
│   ├── usftt-logo.svg          # Main logo (vector)
│   ├── usftt-logo.png          # Main logo (raster fallback)
│   ├── usftt-icon.svg          # Square icon
│   ├── usftt-wide.svg          # Wide variant
│   └── usftt-logo-white.svg    # White/inverted version
├── favicon.ico
└── manifest.json               # Update with logo paths
```

## Implementation Checklist

Once logos are added:
- [ ] Update Navbar component with logo
- [ ] Update MobileNav if needed
- [ ] Add logo to PWA manifest
- [ ] Create favicon from logo
- [ ] Update metadata in index.html
- [ ] Add logo to README.md

## Quick Command to Create Logo Directory

```bash
mkdir -p frontend/public/logo
```

## Notes

- SVG format is strongly preferred for crisp rendering at all sizes
- Ensure logo has transparent background if not full rectangular
- Consider creating a white version for use on colored backgrounds
- Logo should maintain club branding and colors
