# Logo Integration Notes

## Current Status

**Current Logo:** SVG warehouse icon (orange gradient)
- Location: Navigation header `.logo` element
- Format: Inline SVG
- Size: 28x28 viewBox
- Color: Orange gradient (#ff6b35 → #f7931e)

## Logo Files Needed

**Files to locate:**
- `boomlogo1` - Primary logo variant
- `boomlogo2` - Secondary logo variant (possibly dark theme version)

**Expected Location:** iCloud folder (specific path TBD)

## Integration Plan

### 1. Locate Logo Files
```bash
# Search iCloud Drive
find ~/Library/Mobile\ Documents/com~apple~CloudDocs -name "boomlogo*"

# Alternative locations to check
~/Desktop/
~/Downloads/
~/Documents/
```

### 2. Determine Logo Variants
- **Logo 1:** Likely full-color version for light backgrounds
- **Logo 2:** Likely dark theme version or monochrome variant

### 3. HTML Integration

**Current Code (index.html:503-508):**
```html
<a href="#" class="logo">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
    <span class="logo-text">BOOM WAREHOUSE</span>
</a>
```

**Updated Code (after logo integration):**
```html
<a href="#" class="logo">
    <img src="boomlogo1.png" alt="Boom Warehouse" width="28" height="28">
    <span class="logo-text">BOOM WAREHOUSE</span>
</a>
```

### 4. CSS Adjustments

May need to update `.logo` styles for proper image display:
```css
.logo img {
    display: block;
    object-fit: contain;
}
```

### 5. Responsive Considerations

- Mobile: May need smaller logo size
- Retina displays: Consider 2x versions
- Dark theme: Ensure logo has proper contrast

## Playwright Validation

After logo integration, update test:
```typescript
test('should display logo image', async ({ page }) => {
  const logoImg = page.locator('.logo img');
  await expect(logoImg).toBeVisible();
  await expect(logoImg).toHaveAttribute('alt', 'Boom Warehouse');
});
```

## Next Steps

1. ✅ Playwright testing infrastructure set up
2. ⏳ Locate boomlogo1 and boomlogo2 files
3. ⏳ Copy logos to `/docs` folder
4. ⏳ Update HTML to use logo image
5. ⏳ Test with Playwright
6. ⏳ Commit and deploy

## User Feedback

> "Look in boomlogo1 and boomlogo2 in iCloud folder and use that logo. Right now it's just an orange square."

The current SVG warehouse icon appears as an orange square to the user. Need to replace with actual Boom Warehouse logo files.
