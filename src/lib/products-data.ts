// Static product data for Boom Warehouse
// Generated from actual product images and specifications

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  condition: 'Grade A' | 'Grade B' | 'Grade C' | 'Grade D';
  sku: string;
  price: number;
  compareAtPrice?: number;
  brand?: string;
  model?: string;
  year?: number;
  specifications: Record<string, string | number | boolean>;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  weight?: number;
  quantity: number;
  images: string[];
  tags: string[];
  location: string;
  warranty_months: number;
  is_featured?: boolean;
}

export const categories = [
  {
    id: '1',
    name: 'Computers & Electronics',
    slug: 'computers-electronics',
    description: 'Desktop computers, iMacs, and electronic devices'
  },
  {
    id: '2',
    name: 'Appliances',
    slug: 'appliances',
    description: 'Refrigerators, kitchen appliances, and home appliances'
  },
  {
    id: '3',
    name: 'Electronics',
    slug: 'electronics',
    description: 'TVs, projectors, speakers, and electronic accessories'
  },
  {
    id: '4',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'China sets, mirrors, home decor, and garden items'
  },
  {
    id: '5',
    name: 'Sports & Recreation',
    slug: 'sports-recreation',
    description: 'Sports equipment and recreational items'
  }
];

export const products: Product[] = [
  // Featured High-End iMacs
  {
    id: 'imac-2020-27',
    name: 'Apple iMac 27" 2020',
    description: 'Excellent quality Apple iMac 27" 2020 from Apple, powered by Intel i5 3.3GHz with 32GB RAM and 2TB storage. Perfect for professional work and creative projects.',
    category: 'Computers & Electronics',
    condition: 'Grade A',
    sku: 'BW-APP-IMAC-2020-001',
    price: 420.00,
    compareAtPrice: 1299.99,
    brand: 'Apple',
    model: 'iMac',
    year: 2020,
    specifications: {
      screen_size: '27 inches',
      processor: 'Intel i5 3.3GHz',
      ram: '32GB RAM',
      storage: '2TB',
      year: 2020
    },
    dimensions: { width: 25.6, height: 20.3, depth: 8.0 },
    weight: 20.5,
    quantity: 1,
    images: ['/images/products/420_apple_imac_27_2020_intel_i533ghz_32gb_ram_2tb.jpg'],
    tags: ['apple', 'imac', 'desktop', 'professional', 'year-2020'],
    location: 'Warehouse A-1',
    warranty_months: 6,
    is_featured: true
  },
  {
    id: 'imac-2019-27',
    name: 'Apple iMac 27" 2019 Intel i9',
    description: 'Premium Apple iMac 27" 2019 featuring Intel i9 3.6GHz processor with 32GB RAM and 1TB storage. Perfect for demanding creative and professional work.',
    category: 'Computers & Electronics',
    condition: 'Grade A',
    sku: 'BW-APP-IMAC-2019-002',
    price: 349.00,
    compareAtPrice: 1799.99,
    brand: 'Apple',
    model: 'iMac',
    year: 2019,
    specifications: {
      screen_size: '27 inches',
      processor: 'Intel i9 3.6GHz',
      ram: '32GB RAM',
      storage: '1TB',
      year: 2019
    },
    dimensions: { width: 25.6, height: 20.3, depth: 8.0 },
    weight: 20.5,
    quantity: 1,
    images: ['/images/products/349_apple_imac_27_2019_intel_i9_36ghz_32gb_ram_1tb.jpg'],
    tags: ['apple', 'imac', 'desktop', 'professional', 'year-2019', 'i9'],
    location: 'Warehouse A-1',
    warranty_months: 6,
    is_featured: true
  },

  // Dell Desktop
  {
    id: 'dell-desktop-i7',
    name: 'Dell Desktop Computer i7 16GB 1TB Win 11',
    description: 'Reliable Dell desktop computer with Intel i7 processor, 16GB RAM, and 1TB storage. Comes with Windows 11 installed and ready to use.',
    category: 'Computers & Electronics',
    condition: 'Grade B',
    sku: 'BW-DEL-DESK-003',
    price: 159.00,
    compareAtPrice: 449.99,
    brand: 'Dell',
    model: 'Desktop',
    year: 2019,
    specifications: {
      processor: 'Intel i7',
      ram: '16GB RAM',
      storage: '1TB',
      operating_system: 'Windows 11'
    },
    quantity: 1,
    images: ['/images/products/159_dell_desktop_computer_i716gb_1tb_win_11_dell_2.jpg'],
    tags: ['dell', 'desktop', 'windows-11', 'i7'],
    location: 'Warehouse A-1',
    warranty_months: 3,
    is_featured: true
  },

  // Large Appliances - Featured
  {
    id: 'frigidaire-gallery-32cf',
    name: 'Frigidaire Gallery 32 Cu Ft Refrigerator',
    description: 'Premium Frigidaire Gallery 32 cubic foot stainless steel refrigerator. Large capacity perfect for families with modern features and energy efficiency.',
    category: 'Appliances',
    condition: 'Grade A',
    sku: 'BW-FRI-REF-004',
    price: 7900.00,
    compareAtPrice: 2499.99,
    brand: 'Frigidaire',
    model: 'Gallery',
    specifications: {
      capacity: '32 cu ft',
      finish: 'Stainless Steel'
    },
    dimensions: { width: 36.0, height: 70.0, depth: 32.0 },
    weight: 300.0,
    quantity: 1,
    images: ['/images/products/7900_new_frigidaire_gallery_32_cu_ft_refrigerator.jpg'],
    tags: ['frigidaire', 'refrigerator', 'stainless-steel', 'large-capacity'],
    location: 'Warehouse B-1',
    warranty_months: 12,
    is_featured: true
  },

  // Large TV
  {
    id: 'sharp-60-aquos-tv',
    name: 'Sharp 60" Aquos LED TV',
    description: 'Large Sharp 60-inch Aquos LED TV with excellent picture quality. Perfect for home entertainment and large living rooms.',
    category: 'Electronics',
    condition: 'Grade B',
    sku: 'BW-SHA-TV-005',
    price: 249.00,
    compareAtPrice: 799.99,
    brand: 'Sharp',
    model: 'Aquos LED TV',
    specifications: {
      screen_size: '60 inches',
      display_type: 'LED'
    },
    quantity: 1,
    images: ['/images/products/24900_pre-owned_60_sharp_aquos_led_tv_model_lc-60l.jpg'],
    tags: ['sharp', 'tv', 'led', '60-inch'],
    location: 'Warehouse A-2',
    warranty_months: 3,
    is_featured: true
  },

  // Projectors
  {
    id: 'hitachi-projector',
    name: 'Hitachi CP-WX625 3LCD Projector',
    description: 'Professional Hitachi CP-WX625 3LCD projector delivering 4000 lumens. Perfect for business presentations and home theater.',
    category: 'Electronics',
    condition: 'Grade C',
    sku: 'BW-HIT-PROJ-006',
    price: 75.00,
    compareAtPrice: 299.99,
    brand: 'Hitachi',
    model: 'CP-WX625',
    specifications: {
      lumens: '4000 lumens',
      technology: '3LCD'
    },
    quantity: 1,
    images: ['/images/products/75_hitachi_cp-wx625_3lcd_projector_4000_lumens_hd.jpg'],
    tags: ['hitachi', 'projector', '3lcd', 'professional'],
    location: 'Warehouse A-3',
    warranty_months: 3
  },

  {
    id: 'christie-projector',
    name: 'Christie LW400 LCD Projector',
    description: 'High-quality Christie LW400 LCD projector for professional presentations and home theater use.',
    category: 'Electronics',
    condition: 'Grade C',
    sku: 'BW-CHR-PROJ-007',
    price: 99.00,
    compareAtPrice: 399.99,
    brand: 'Christie',
    model: 'LW400',
    specifications: {
      technology: 'LCD'
    },
    quantity: 1,
    images: ['/images/products/99_christie_lw400_lcd_projector_boomwarehouse_4554.jpg'],
    tags: ['christie', 'projector', 'lcd', 'professional'],
    location: 'Warehouse A-3',
    warranty_months: 3
  },

  // More iMacs at various price points
  {
    id: 'imac-2017-premium',
    name: 'Apple iMac 27" 2017 Premium',
    description: 'High-end Apple iMac 27" 2017 with premium specifications. Excellent for professional creative work.',
    category: 'Computers & Electronics',
    condition: 'Grade B',
    sku: 'BW-APP-IMAC-2017-008',
    price: 330.00,
    compareAtPrice: 1299.99,
    brand: 'Apple',
    model: 'iMac',
    year: 2017,
    specifications: {
      screen_size: '27 inches',
      year: 2017
    },
    dimensions: { width: 25.6, height: 20.3, depth: 8.0 },
    weight: 20.5,
    quantity: 1,
    images: ['/images/products/33000_pre-owned_apple_imac_27_screen_2017_intel_xe.jpg'],
    tags: ['apple', 'imac', 'desktop', 'year-2017'],
    location: 'Warehouse A-1',
    warranty_months: 3
  },

  {
    id: 'imac-2015',
    name: 'Apple iMac 27" 2015',
    description: 'Reliable Apple iMac 27" 2015 with Intel i5 processor. Great for general computing and light creative work.',
    category: 'Computers & Electronics',
    condition: 'Grade B',
    sku: 'BW-APP-IMAC-2015-009',
    price: 199.00,
    compareAtPrice: 899.99,
    brand: 'Apple',
    model: 'iMac',
    year: 2015,
    specifications: {
      screen_size: '27 inches',
      processor: 'Intel i5',
      year: 2015
    },
    dimensions: { width: 25.6, height: 20.3, depth: 8.0 },
    weight: 20.5,
    quantity: 1,
    images: ['/images/products/19900_pre-owned_apple_imac_27_screen_2015_intel_i5.jpg'],
    tags: ['apple', 'imac', 'desktop', 'year-2015'],
    location: 'Warehouse A-1',
    warranty_months: 3
  },

  // Refrigerators
  {
    id: 'frigidaire-75cf',
    name: 'Frigidaire 7.5 Cu Ft Refrigerator',
    description: 'Compact Frigidaire 7.5 cubic foot refrigerator with freezer. Perfect for apartments, offices, or small spaces.',
    category: 'Appliances',
    condition: 'Grade A',
    sku: 'BW-FRI-REF-010',
    price: 149.00,
    compareAtPrice: 399.99,
    brand: 'Frigidaire',
    specifications: {
      capacity: '7.5 cu ft'
    },
    dimensions: { width: 21.0, height: 55.0, depth: 21.0 },
    weight: 100.0,
    quantity: 1,
    images: ['/images/products/149_frigidaire_75cf_refrigerator_freezer_55x21x21.jpg'],
    tags: ['frigidaire', 'refrigerator', 'compact'],
    location: 'Warehouse B-1',
    warranty_months: 6
  },

  {
    id: 'frigidaire-mini',
    name: 'Frigidaire 1.6 Cu Ft Mini Refrigerator',
    description: 'Stylish retro Frigidaire 1.6 cubic foot mini refrigerator. Perfect for dorms, offices, or personal use.',
    category: 'Appliances',
    condition: 'Grade A',
    sku: 'BW-FRI-MINI-011',
    price: 69.00,
    compareAtPrice: 199.99,
    brand: 'Frigidaire',
    specifications: {
      capacity: '1.6 cu ft',
      style: 'Retro'
    },
    dimensions: { width: 17.7, height: 19.4, depth: 18.6 },
    weight: 40.0,
    quantity: 1,
    images: ['/images/products/6900_frigidaire_16_cu_ft_mini_refrigerator_retro_s.jpg'],
    tags: ['frigidaire', 'mini-fridge', 'retro', 'compact'],
    location: 'Warehouse B-2',
    warranty_months: 3
  },

  // Home & Garden Items
  {
    id: 'excel-china-set',
    name: 'Excel Fine China Set',
    description: 'Beautiful Excel fine china set in excellent condition. Perfect for special occasions and elegant dining.',
    category: 'Home & Garden',
    condition: 'Grade B',
    sku: 'BW-EXC-CHI-012',
    price: 199.00,
    compareAtPrice: 499.99,
    brand: 'Excel',
    specifications: {},
    quantity: 1,
    images: ['/images/products/199_excel_fine_china_set_boomwarehouse_4554_renais.jpg'],
    tags: ['excel', 'china', 'dinnerware', 'elegant'],
    location: 'Warehouse C-1',
    warranty_months: 1
  },

  {
    id: 'mikasa-china-set',
    name: 'Mikasa Blair Fine China Set',
    description: 'Elegant Mikasa Blair fine china set in like new condition. Beautiful addition to any dining collection.',
    category: 'Home & Garden',
    condition: 'Grade A',
    sku: 'BW-MIK-CHI-013',
    price: 250.00,
    compareAtPrice: 699.99,
    brand: 'Mikasa',
    model: 'Blair',
    specifications: {},
    quantity: 1,
    images: ['/images/products/250_mikasablair_fine_china_set_like_new_boomwareho.jpg'],
    tags: ['mikasa', 'china', 'dinnerware', 'like-new'],
    location: 'Warehouse C-1',
    warranty_months: 3
  },

  // Kitchen Appliances
  {
    id: 'frigidaire-cooking-plate',
    name: 'Frigidaire 2-in-1 Cooking Plate/Pizza Maker',
    description: 'Versatile Frigidaire 2-in-1 cooking plate and pizza maker. Perfect for quick meals and entertaining.',
    category: 'Appliances',
    condition: 'Grade A',
    sku: 'BW-FRI-COO-014',
    price: 35.00,
    compareAtPrice: 89.99,
    brand: 'Frigidaire',
    specifications: {
      type: '2-in-1 Cooking Plate/Pizza Maker'
    },
    quantity: 1,
    images: ['/images/products/35_frigidaire_2_in_1_cooking_platepizza_maker_boom.jpg'],
    tags: ['frigidaire', 'cooking', 'pizza-maker', 'kitchen'],
    location: 'Warehouse B-3',
    warranty_months: 3
  },

  // Older iMacs - Budget options
  {
    id: 'imac-2013',
    name: 'Apple iMac 27" 2013',
    description: 'Classic Apple iMac 27" 2013 with Intel i5 processor. Great budget option for basic computing needs.',
    category: 'Computers & Electronics',
    condition: 'Grade C',
    sku: 'BW-APP-IMAC-2013-015',
    price: 190.00,
    compareAtPrice: 599.99,
    brand: 'Apple',
    model: 'iMac',
    year: 2013,
    specifications: {
      screen_size: '27 inches',
      processor: 'Intel i5',
      year: 2013
    },
    dimensions: { width: 25.6, height: 20.3, depth: 8.0 },
    weight: 20.5,
    quantity: 1,
    images: ['/images/products/19000_pre-owned_apple_imac_27_screen_2013_intel_i5.jpg'],
    tags: ['apple', 'imac', 'desktop', 'year-2013', 'budget'],
    location: 'Warehouse A-1',
    warranty_months: 1
  },

  {
    id: 'imac-2010',
    name: 'Apple iMac 27" 2010',
    description: 'Vintage Apple iMac 27" 2010 with Intel i5 processor. Perfect for basic computing or as a second computer.',
    category: 'Computers & Electronics',
    condition: 'Grade D',
    sku: 'BW-APP-IMAC-2010-016',
    price: 69.00,
    compareAtPrice: 299.99,
    brand: 'Apple',
    model: 'iMac',
    year: 2010,
    specifications: {
      screen_size: '27 inches',
      processor: 'Intel i5',
      year: 2010
    },
    dimensions: { width: 25.6, height: 20.3, depth: 8.0 },
    weight: 20.5,
    quantity: 1,
    images: ['/images/products/6900_pre-owned_apple_imac_27_screen_2010_intel_i5.jpg'],
    tags: ['apple', 'imac', 'desktop', 'year-2010', 'vintage'],
    location: 'Warehouse A-1',
    warranty_months: 1
  },

  // Multiple iMacs deal
  {
    id: 'imacs-bundle',
    name: 'Apple iMacs - Good Working Ready to Go',
    description: 'Bundle of Apple iMacs in good working condition, ready to use. Perfect for offices or educational settings.',
    category: 'Computers & Electronics',
    condition: 'Grade C',
    sku: 'BW-APP-BUNDLE-017',
    price: 49.00,
    compareAtPrice: 199.99,
    brand: 'Apple',
    model: 'iMac',
    specifications: {
      condition: 'Good working'
    },
    dimensions: { width: 25.6, height: 20.3, depth: 8.0 },
    weight: 20.5,
    quantity: 1,
    images: ['/images/products/49_apple_imacs_good_working_ready_to_go_boomwareho.jpg'],
    tags: ['apple', 'imac', 'bundle', 'bulk'],
    location: 'Warehouse A-1',
    warranty_months: 1
  }
];

// Get featured products
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.is_featured);
};

// Get products by category
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

// Get product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Get products by condition
export const getProductsByCondition = (condition: string): Product[] => {
  return products.filter(product => product.condition === condition);
};

// Search products
export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.brand?.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.includes(searchTerm))
  );
};