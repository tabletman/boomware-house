import { test, expect } from '@playwright/test';

test.describe('Boom Warehouse Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://tabletman.github.io/boomware-house/');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Boom Warehouse/);
  });

  test('should display navigation elements', async ({ page }) => {
    // Logo (either image or text)
    const logo = page.locator('.logo');
    await expect(logo).toBeVisible();

    // Search box
    const searchBox = page.locator('.search-box input');
    await expect(searchBox).toBeVisible();
    await expect(searchBox).toHaveAttribute('placeholder', /Search for products/);

    // Navigation links (exact matches to avoid duplicates)
    await expect(page.locator('.nav-links a[href="#categories"]')).toContainText('Categories');
    await expect(page.locator('.nav-links a[href="#featured"]')).toContainText('Shop');
    await expect(page.locator('.nav-links a[href="#about"]')).toContainText('About');
    await expect(page.locator('.nav-links a[href="#contact"]')).toContainText('Contact');

    // Cart icon
    const cartIcon = page.locator('.cart-icon');
    await expect(cartIcon).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    await expect(page.locator('.hero-banner h1')).toContainText('Quality Electronics & Tech Gear');
    await expect(page.locator('.hero-banner p')).toContainText('Discover premium products');
    await expect(page.getByRole('link', { name: 'Shop Now' })).toBeVisible();
  });

  test('should display all 8 product categories', async ({ page }) => {
    const categories = [
      'Computers & Laptops',
      'Mobile & Tablets',
      'Audio & Headphones',
      'Cameras & Photo',
      'Gaming',
      'TVs & Home Theater',
      'Smart Home',
      'Wearables'
    ];

    for (const category of categories) {
      await expect(page.locator('.category-card h3').filter({ hasText: category })).toBeVisible();
    }
  });

  test('should display featured products', async ({ page }) => {
    const products = [
      { name: 'Gaming Laptop Pro', price: '$1,299.99' },
      { name: 'Flagship Smartphone', price: '$899.99' },
      { name: 'Noise-Canceling Headphones', price: '$349.99' },
      { name: 'Premium Smartwatch', price: '$449.99' },
      { name: 'Mirrorless Camera Kit', price: '$1,599.99' },
      { name: 'Next-Gen Console', price: '$499.99' }
    ];

    for (const product of products) {
      await expect(page.locator('.product-title').filter({ hasText: product.name })).toBeVisible();
      await expect(page.locator('.product-price').filter({ hasText: product.price })).toBeVisible();
    }
  });

  test('should have "Add to Cart" buttons for all products', async ({ page }) => {
    const addToCartButtons = page.locator('.btn-add-cart');
    const count = await addToCartButtons.count();
    expect(count).toBe(6); // 6 featured products
  });

  test('should display "Why Choose Us" section', async ({ page }) => {
    await expect(page.locator('.features-section .section-title')).toContainText('Why Shop at Boom Warehouse?');

    const features = [
      'Fast Shipping',
      'Secure Checkout',
      'Quality Guarantee',
      'Expert Support'
    ];

    for (const feature of features) {
      await expect(page.locator('.feature-item h3').filter({ hasText: feature })).toBeVisible();
    }
  });

  test('should display footer sections', async ({ page }) => {
    // Footer sections
    await expect(page.locator('.footer-section h4').filter({ hasText: 'Shop' })).toBeVisible();
    await expect(page.locator('.footer-section h4').filter({ hasText: 'Customer Service' })).toBeVisible();
    await expect(page.locator('.footer-section h4').filter({ hasText: 'About Us' })).toBeVisible();
    await expect(page.locator('.footer-section h4').filter({ hasText: 'My Account' })).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that main elements are still visible on mobile
    await expect(page.locator('.logo')).toBeVisible();
    await expect(page.locator('.hero-banner h1')).toBeVisible();
    await expect(page.locator('.categories-grid')).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    // Check layout adapts to tablet
    await expect(page.locator('.logo')).toBeVisible();
    await expect(page.locator('.hero-banner h1')).toBeVisible();
  });

  test('should have proper dark theme styling', async ({ page }) => {
    const body = page.locator('body');
    const bgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);

    // Verify dark background (should be rgb(10, 10, 10) which is #0a0a0a)
    expect(bgColor).toBe('rgb(10, 10, 10)');
  });

  test('should take full page screenshot', async ({ page }) => {
    await page.screenshot({
      path: 'tests/visual/screenshots/landing-page-full.png',
      fullPage: true
    });
  });

  test('should take viewport screenshots at different sizes', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({
      path: 'tests/visual/screenshots/landing-page-desktop.png'
    });

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({
      path: 'tests/visual/screenshots/landing-page-tablet.png'
    });

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: 'tests/visual/screenshots/landing-page-mobile.png'
    });
  });
});
