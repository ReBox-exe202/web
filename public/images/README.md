# Package Images

## 📁 Image Location
All package images should be placed in this directory: `/public/images/`

## 🖼️ Required Images

### 1. Cup Placeholder
**Filename:** `cup-placeholder.png`  
**Recommended Size:** 800x800px  
**Format:** PNG with transparency  
**Description:** Image of a reusable cup

### 2. Box Placeholder
**Filename:** `box-placeholder.png`  
**Recommended Size:** 800x800px  
**Format:** PNG with transparency  
**Description:** Image of a reusable box

### 3. Bowl Placeholder
**Filename:** `bowl-placeholder.png`  
**Recommended Size:** 800x800px  
**Format:** PNG with transparency  
**Description:** Image of a reusable bowl

### 4. Generic Package Placeholder
**Filename:** `package-placeholder.png`  
**Recommended Size:** 800x800px  
**Format:** PNG with transparency  
**Description:** Generic package icon (fallback)

## 📝 Image Guidelines

### Size & Format
- **Aspect Ratio:** 1:1 (square)
- **Minimum Size:** 400x400px
- **Recommended Size:** 800x800px
- **Maximum Size:** 1200x1200px
- **Format:** PNG (preferred) or JPG
- **Background:** Transparent (PNG) or white (JPG)

### Quality
- High resolution for QR code printing
- Clear product visibility
- Professional photography
- Consistent lighting and angles
- Clean background

### Naming Convention
```
{type}-placeholder.png
```

Examples:
- `cup-placeholder.png`
- `box-placeholder.png`
- `bowl-placeholder.png`

## 🎨 Fallback Behavior

If an image is not found, the system will:
1. Try to load the specific type image (e.g., `cup-placeholder.png`)
2. If not found, show a Package icon placeholder
3. Display remains functional with icon overlay

## 💡 Usage in Code

```typescript
// In package detail page
const getPackageImage = (type: string) => {
  const images: Record<string, string> = {
    cup: "/images/cup-placeholder.png",
    box: "/images/box-placeholder.png",
    bowl: "/images/bowl-placeholder.png",
  }
  return images[type] || "/images/package-placeholder.png"
}
```

## 🚀 Quick Setup

### Option 1: Use Placeholder Service
For development, you can use placeholder services:

```typescript
// Temporary placeholder URLs
const images = {
  cup: "https://via.placeholder.com/800/E8F5E9/4CAF50?text=Cup",
  box: "https://via.placeholder.com/800/E3F2FD/2196F3?text=Box",
  bowl: "https://via.placeholder.com/800/FFF3E0/FF9800?text=Bowl",
}
```

### Option 2: Generate Simple Icons
Use Figma, Canva, or similar tools to create simple icons:
1. Create 800x800px canvas
2. Add icon/illustration of the package type
3. Export as PNG with transparency
4. Save to `/public/images/`

### Option 3: Use Stock Photos
Download from:
- [Unsplash](https://unsplash.com/) - Free high-quality images
- [Pexels](https://pexels.com/) - Free stock photos
- [Pixabay](https://pixabay.com/) - Free images

Search terms:
- "reusable cup"
- "food container"
- "takeaway box"
- "lunch bowl"

## 📦 Current Status

```
public/
  images/
    └── README.md (this file)
```

**TODO:** Add the following files:
- [ ] cup-placeholder.png
- [ ] box-placeholder.png
- [ ] bowl-placeholder.png
- [ ] package-placeholder.png

## 🔍 Testing

After adding images, test by:
1. Navigate to `/package/PKG-001` (or any package)
2. Check if image displays correctly
3. Verify all package types (cup, box, bowl)
4. Test on different screen sizes
5. Verify image loading performance

## 🎯 SEO & Performance

### Image Optimization
```bash
# Install optimization tools
npm install sharp

# Optimize images (optional)
npx sharp input.png -o output.png --resize 800 800
```

### Next.js Image Optimization
Images are automatically optimized by Next.js `Image` component:
- Lazy loading
- Responsive sizing
- Format conversion (WebP)
- Blur placeholder

## 📱 Responsive Behavior

The image component is set to:
- `aspect-square` - maintains 1:1 ratio
- `object-contain` - fits within container
- Padding: 8 (2rem) on all sides
- Background: muted gray
- Rounded corners

## 🆘 Troubleshooting

### Image not displaying?
1. Check filename matches exactly (case-sensitive)
2. Verify file is in `/public/images/`
3. Check file extension (.png or .jpg)
4. Clear browser cache
5. Restart Next.js dev server

### Image too large?
1. Resize to 800x800px
2. Compress using tools like TinyPNG
3. Convert to WebP format
4. Use Next.js Image optimization

### Image quality poor?
1. Use higher resolution source
2. Export at 2x size (1600x1600px)
3. Use PNG for better quality
4. Avoid excessive compression

---

**Last Updated:** October 13, 2025  
**Maintained by:** ReBox Team
