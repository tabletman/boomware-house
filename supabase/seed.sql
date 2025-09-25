-- Insert sample categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Computers & Laptops', 'computers-laptops', 'Desktop computers, laptops, and workstations', 1),
('Computer Parts', 'computer-parts', 'CPUs, GPUs, RAM, motherboards, and storage', 2),
('Monitors & Displays', 'monitors-displays', 'LCD, LED, and gaming monitors', 3),
('Mobile Devices', 'mobile-devices', 'Smartphones, tablets, and accessories', 4),
('Audio & Video', 'audio-video', 'Headphones, speakers, cameras, and AV equipment', 5),
('Networking', 'networking', 'Routers, switches, and networking equipment', 6),
('Appliances', 'appliances', 'Small appliances and refrigerators', 7),
('Gaming', 'gaming', 'Gaming consoles, controllers, and accessories', 8);

-- Insert sample products
INSERT INTO products (name, description, category, condition, sku, price, compare_at_price, cost, quantity, brand, model, year, warranty_months, is_featured, tags) VALUES
-- Computers & Laptops
('Dell OptiPlex 7070 Desktop', 'Business-grade desktop computer with Intel Core i5 processor, 8GB RAM, 256GB SSD. Perfect for office work and light gaming.', 'Computers & Laptops', 'Grade A', 'DELL-OPX-7070-001', 299.99, 399.99, 200.00, 3, 'Dell', 'OptiPlex 7070', 2019, 6, true, ARRAY['desktop', 'business', 'intel']),
('Lenovo ThinkPad T480 Laptop', 'Professional laptop with Intel Core i7, 16GB RAM, 512GB SSD. Excellent build quality with minor cosmetic wear.', 'Computers & Laptops', 'Grade B', 'LEN-TP-T480-002', 449.99, 599.99, 300.00, 2, 'Lenovo', 'ThinkPad T480', 2018, 3, true, ARRAY['laptop', 'business', 'thinkpad']),
('HP Pavilion Desktop', 'Home desktop computer with AMD Ryzen 5, 12GB RAM, 1TB HDD. Good for everyday computing tasks.', 'Computers & Laptops', 'Grade C', 'HP-PAV-DT-003', 199.99, 299.99, 150.00, 1, 'HP', 'Pavilion', 2020, 3, false, ARRAY['desktop', 'home', 'amd']),

-- Computer Parts
('NVIDIA GTX 1660 Graphics Card', 'Mid-range graphics card perfect for 1080p gaming. Tested and working perfectly.', 'Computer Parts', 'Grade A', 'NV-GTX1660-004', 179.99, 249.99, 120.00, 4, 'NVIDIA', 'GeForce GTX 1660', 2019, 6, true, ARRAY['gpu', 'gaming', 'nvidia']),
('Corsair Vengeance 16GB RAM', 'DDR4 3200MHz memory kit (2x8GB). Excellent for gaming and productivity builds.', 'Computer Parts', 'Grade A', 'COR-VEN-16GB-005', 59.99, 89.99, 40.00, 6, 'Corsair', 'Vengeance LPX', 2020, 12, false, ARRAY['ram', 'memory', 'ddr4']),
('Samsung 970 EVO 500GB SSD', 'M.2 NVMe SSD with fast read/write speeds. Shows some usage but plenty of life remaining.', 'Computer Parts', 'Grade B', 'SAM-970EVO-006', 49.99, 79.99, 35.00, 3, 'Samsung', '970 EVO', 2019, 6, false, ARRAY['ssd', 'storage', 'm.2']),

-- Monitors & Displays
('Dell UltraSharp U2719D Monitor', '27-inch QHD monitor with excellent color accuracy. Minor scuff on base, screen perfect.', 'Monitors & Displays', 'Grade B', 'DELL-U2719D-007', 199.99, 299.99, 130.00, 2, 'Dell', 'UltraSharp U2719D', 2019, 6, true, ARRAY['monitor', 'qhd', '27inch']),
('ASUS TUF Gaming VG24VQ', '24-inch curved gaming monitor, 144Hz refresh rate. Excellent for competitive gaming.', 'Monitors & Displays', 'Grade A', 'ASUS-VG24VQ-008', 149.99, 199.99, 100.00, 3, 'ASUS', 'TUF Gaming VG24VQ', 2020, 12, true, ARRAY['monitor', 'gaming', '144hz', 'curved']),

-- Mobile Devices
('iPhone 12 128GB Unlocked', 'Unlocked iPhone 12 in excellent condition. Battery health 89%. Minor wear on corners.', 'Mobile Devices', 'Grade B', 'APL-IP12-128-009', 399.99, 499.99, 280.00, 1, 'Apple', 'iPhone 12', 2020, 6, true, ARRAY['smartphone', 'unlocked', 'ios']),
('iPad Air 64GB WiFi', '4th generation iPad Air in good condition. Some light scratches on back, screen is perfect.', 'Mobile Devices', 'Grade C', 'APL-IPADAIR-010', 279.99, 379.99, 200.00, 2, 'Apple', 'iPad Air', 2020, 3, false, ARRAY['tablet', 'wifi', 'ipad']),

-- Audio & Video
('Sony WH-1000XM4 Headphones', 'Premium noise-canceling headphones. Excellent sound quality with minor wear on headband.', 'Audio & Video', 'Grade B', 'SONY-WH1000XM4-011', 199.99, 299.99, 130.00, 2, 'Sony', 'WH-1000XM4', 2020, 6, true, ARRAY['headphones', 'wireless', 'noise-canceling']),
('Canon EOS Rebel T7 DSLR', 'Entry-level DSLR camera with 18-55mm lens. Perfect for photography beginners.', 'Audio & Video', 'Grade A', 'CAN-T7-DSLR-012', 349.99, 449.99, 250.00, 1, 'Canon', 'EOS Rebel T7', 2019, 6, false, ARRAY['camera', 'dslr', 'photography']),

-- Appliances
('Keurig K-Classic Coffee Maker', 'Single-serve coffee maker in working condition. Some mineral buildup, needs descaling.', 'Appliances', 'Grade C', 'KEU-KCLASS-013', 39.99, 69.99, 25.00, 2, 'Keurig', 'K-Classic', 2019, 3, false, ARRAY['coffee', 'appliance', 'kitchen']),
('Cuisinart Mini Food Processor', 'Compact food processor perfect for small kitchens. All parts included and working.', 'Appliances', 'Grade B', 'CUI-MINI-FP-014', 29.99, 49.99, 18.00, 3, 'Cuisinart', 'Mini-Prep Plus', 2020, 6, false, ARRAY['food-processor', 'kitchen', 'appliance']),

-- Gaming
('PlayStation 4 Slim 1TB', 'Gaming console with 1 controller. System works perfectly, controller has stick drift.', 'Gaming', 'Grade C', 'SONY-PS4-SLIM-015', 199.99, 299.99, 140.00, 1, 'Sony', 'PlayStation 4 Slim', 2018, 6, true, ARRAY['gaming', 'console', 'playstation']),
('Xbox Wireless Controller', 'Official Microsoft controller for Xbox and PC. Excellent condition with minor wear.', 'Gaming', 'Grade B', 'MS-XBOX-CTRL-016', 39.99, 59.99, 25.00, 4, 'Microsoft', 'Xbox Wireless Controller', 2020, 6, false, ARRAY['controller', 'xbox', 'wireless']);

-- Update some products with serial numbers and locations
UPDATE products SET
    serial_number = 'DL' || LPAD((RANDOM() * 999999999)::INTEGER::TEXT, 9, '0'),
    location = 'A' || (FLOOR(RANDOM() * 10) + 1)::TEXT || '-' || (FLOOR(RANDOM() * 20) + 1)::TEXT
WHERE category IN ('Computers & Laptops', 'Mobile Devices');

UPDATE products SET
    location = 'B' || (FLOOR(RANDOM() * 5) + 1)::TEXT || '-' || (FLOOR(RANDOM() * 15) + 1)::TEXT
WHERE category IN ('Computer Parts', 'Monitors & Displays');

UPDATE products SET
    location = 'C' || (FLOOR(RANDOM() * 3) + 1)::TEXT || '-' || (FLOOR(RANDOM() * 10) + 1)::TEXT
WHERE category IN ('Audio & Video', 'Gaming', 'Appliances');