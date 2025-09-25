-- Insert categories

INSERT INTO categories (
    id, name, slug, description, is_active
) VALUES (
    '54a5a2ff-95ee-42ff-afa1-57328f0ab039',
    'Computers & Electronics',
    'computers-electronics',
    'Desktop computers, iMacs, and electronic devices',
    true
);
INSERT INTO categories (
    id, name, slug, description, is_active
) VALUES (
    'a35bb4be-4061-4e39-983a-c43271562955',
    'Appliances',
    'appliances',
    'Refrigerators, kitchen appliances, and home appliances',
    true
);
INSERT INTO categories (
    id, name, slug, description, is_active
) VALUES (
    '91972698-cd74-4f96-981a-d37113c525d2',
    'Electronics',
    'electronics',
    'TVs, projectors, speakers, and electronic accessories',
    true
);
INSERT INTO categories (
    id, name, slug, description, is_active
) VALUES (
    '21d7a629-9c9a-4dbc-863a-79d00b15bb6a',
    'Home & Garden',
    'home-garden',
    'China sets, mirrors, home decor, and garden items',
    true
);
INSERT INTO categories (
    id, name, slug, description, is_active
) VALUES (
    '65e5a917-d86c-44fe-bd4b-ce13829ce5d5',
    'Sports & Recreation',
    'sports-recreation',
    'Sports equipment and recreational items',
    true
);
INSERT INTO categories (
    id, name, slug, description, is_active
) VALUES (
    '6c4d9956-588e-4987-99f6-0eab4d417358',
    'General Merchandise',
    'general-merchandise',
    'Miscellaneous items and general products',
    true
);
-- Insert products

INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    'fa0c0af3-366c-409f-ac2c-d540528b5c28',
    'Apple Pre-Owned Apple Imac Screen Intel Xe',
    'Excellent quality apple pre-owned apple imac screen intel xe from Apple. Perfect for home or office use.',
    'Computers & Electronics',
    'Grade B',
    'BW-APP-IMAC-2017-537',
    33000.0,
    'Apple',
    'iMac',
    2017,
    1,
    '{"/images/products/33000_pre-owned_apple_imac_27_screen_2017_intel_xe.jpg"}',
    '{"year": 2017}',
    '{"width": 25.6, "height": 20.3, "depth": 8.0}',
    20.5,
    'Warehouse A-1',
    3,
    '{"apple","year-2017","computers-electronics","pre-owned"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '8f9d74e9-92bc-486a-b117-f813b5bc3e79',
    'Excel Fine China Set',
    'Excellent quality excel fine china set from Excel. Perfect for home or office use.',
    'Home & Garden',
    'Grade B',
    'BW-EXC-GEN-365',
    199.0,
    'Excel',
    NULL,
    NULL,
    1,
    '{"/images/products/199_excel_fine_china_set_boomwarehouse_4554_renais.jpg"}',
    '{}',
    NULL,
    NULL,
    'Warehouse A-1',
    3,
    '{"home-garden","excel"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '7e03919d-99f1-4a8a-b77d-36698d996c27',
    'Hitachi Cp-Wx625 3Lcd Projector Lumens Hd',
    'Excellent quality hitachi cp-wx625 3lcd projector lumens hd from Hitachi. Perfect for home or office use.',
    'Electronics',
    'Grade B',
    'BW-HIT-CPWX62-837',
    75.0,
    'Hitachi',
    'CP-WX625',
    NULL,
    1,
    '{"/images/products/75_hitachi_cp-wx625_3lcd_projector_4000_lumens_hd.jpg"}',
    '{}',
    NULL,
    NULL,
    'Warehouse A-1',
    3,
    '{"electronics","hitachi"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '195931d3-950a-473c-a5fc-5c7cacbde792',
    'Frigidaire Cu Ft Mini Refrigerator Retro S',
    'Excellent quality frigidaire cu ft mini refrigerator retro s from Frigidaire. Perfect for home or office use.',
    'Appliances',
    'Grade B',
    'BW-FRI-GEN-596',
    6900.0,
    'Frigidaire',
    NULL,
    NULL,
    1,
    '{"/images/products/6900_frigidaire_16_cu_ft_mini_refrigerator_retro_s.jpg"}',
    '{}',
    '{"width": 17.7, "height": 19.4, "depth": 18.6}',
    40.0,
    'Warehouse A-1',
    3,
    '{"appliances","frigidaire"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    'b65ba4c9-6a95-49ba-b620-e8c61b464b32',
    'Dell Desktop Computer I716Gb 1Tb Win Dell',
    'Excellent quality dell desktop computer i716gb 1tb win dell from Dell, powered by Intel i7, and 1TB storage. Perfect for home or office use.',
    'Computers & Electronics',
    'Grade B',
    'BW-DEL-GEN-838',
    159.0,
    'Dell',
    NULL,
    NULL,
    1,
    '{"/images/products/159_dell_desktop_computer_i716gb_1tb_win_11_dell_2.jpg"}',
    '{"processor": "Intel i7", "storage": "1TB"}',
    NULL,
    NULL,
    'Warehouse A-1',
    3,
    '{"dell","computers-electronics","intel-i7"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '8863445f-1c25-462e-b001-eb0482a1bec7',
    'Apple Pre-Owned Apple Imac Screen Intel I5',
    'Excellent quality apple pre-owned apple imac screen intel i5 from Apple, powered by Intel i5. Perfect for home or office use.',
    'Computers & Electronics',
    'Grade B',
    'BW-APP-IMAC-2010-260',
    6900.0,
    'Apple',
    'iMac',
    2010,
    1,
    '{"/images/products/6900_pre-owned_apple_imac_27_screen_2010_intel_i5.jpg"}',
    '{"year": 2010, "processor": "Intel i5"}',
    '{"width": 25.6, "height": 20.3, "depth": 8.0}',
    20.5,
    'Warehouse A-1',
    3,
    '{"year-2010","intel-i5","apple","computers-electronics","pre-owned"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    'b151655a-9d25-493c-8fb0-d78ec1badbc8',
    'Basketball Hoop Good Condition',
    'Good working basketball hoop good condition . Perfect for home or office use.',
    'Sports & Recreation',
    'Grade C',
    'BW-UNK-GEN-651',
    200.0,
    NULL,
    NULL,
    NULL,
    1,
    '{"/images/products/200_basketball_hoop_good_condition_boomwarehouse_4.jpg"}',
    '{}',
    NULL,
    NULL,
    'Warehouse A-1',
    1,
    '{"sports-recreation"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '865f986b-ab51-4fb2-a640-533d15e01d75',
    'Framed Art',
    'Excellent quality framed art . Perfect for home or office use.',
    'Home & Garden',
    'Grade B',
    'BW-UNK-GEN-490',
    45.0,
    NULL,
    NULL,
    NULL,
    1,
    '{"/images/products/45_framed_art_boomwarehouse_4554_renaissance_pkwy.jpg"}',
    '{}',
    NULL,
    NULL,
    'Warehouse A-1',
    3,
    '{"home-garden"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '8cbfc137-4b17-405b-8644-dacee7430be3',
    'Mikasablair Fine China Set Like New Boomwareho',
    'Excellent quality mikasablair fine china set like new boomwareho from Mikasa. Perfect for home or office use.',
    'Home & Garden',
    'Grade A',
    'BW-MIK-GEN-953',
    250.0,
    'Mikasa',
    NULL,
    NULL,
    1,
    '{"/images/products/250_mikasablair_fine_china_set_like_new_boomwareho.jpg"}',
    '{}',
    NULL,
    NULL,
    'Warehouse A-1',
    3,
    '{"home-garden","new","mikasa"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '206d7259-59ef-4e93-bb94-170710b8215e',
    'Apple Pre-Owned Apple Imac Screen Intel I5',
    'Excellent quality apple pre-owned apple imac screen intel i5 from Apple, powered by Intel i5. Perfect for home or office use.',
    'Computers & Electronics',
    'Grade B',
    'BW-APP-IMAC-2015-847',
    19900.0,
    'Apple',
    'iMac',
    2015,
    1,
    '{"/images/products/19900_pre-owned_apple_imac_27_screen_2015_intel_i5.jpg"}',
    '{"year": 2015, "processor": "Intel i5"}',
    '{"width": 25.6, "height": 20.3, "depth": 8.0}',
    20.5,
    'Warehouse A-1',
    3,
    '{"intel-i5","apple","year-2015","computers-electronics","pre-owned"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '3e7411ce-25c6-4927-be6d-ed69972e2dfa',
    'Frigidaire Gallery Cu Ft Refrigerator Stai',
    'Excellent quality frigidaire gallery cu ft refrigerator stai from Frigidaire. Perfect for home or office use.',
    'Appliances',
    'Grade B',
    'BW-FRI-GEN-403',
    7900.0,
    'Frigidaire',
    NULL,
    NULL,
    1,
    '{"/images/products/7900_frigidaire_gallery_32_cu_ft_refrigerator_stai.jpg"}',
    '{}',
    '{"width": 28.0, "height": 66.0, "depth": 32.0}',
    200.0,
    'Warehouse A-1',
    3,
    '{"appliances","frigidaire"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    'fceb0161-f523-4e41-a34e-3730f1b9cea5',
    'Apple Pre-Owned Apple Imac Screen Intel I5',
    'Excellent quality apple pre-owned apple imac screen intel i5 from Apple, powered by Intel i5. Perfect for home or office use.',
    'Computers & Electronics',
    'Grade B',
    'BW-APP-IMAC-2013-421',
    19000.0,
    'Apple',
    'iMac',
    2013,
    1,
    '{"/images/products/19000_pre-owned_apple_imac_27_screen_2013_intel_i5.jpg"}',
    '{"year": 2013, "processor": "Intel i5"}',
    '{"width": 25.6, "height": 20.3, "depth": 8.0}',
    20.5,
    'Warehouse A-1',
    3,
    '{"intel-i5","year-2013","apple","computers-electronics","pre-owned"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '49ba45c5-66cc-4169-8699-bf93cd0b694c',
    'Sharp Pre-Owned Sharp Aquos Led Tv Model Lc-60L',
    'Excellent quality sharp pre-owned sharp aquos led tv model lc-60l from Sharp. Perfect for home or office use.',
    'Electronics',
    'Grade B',
    'BW-SHA-LC60LE-320',
    24900.0,
    'Sharp',
    'LC-60LE650U',
    NULL,
    1,
    '{"/images/products/24900_pre-owned_60_sharp_aquos_led_tv_model_lc-60l.jpg"}',
    '{}',
    NULL,
    NULL,
    'Warehouse A-1',
    3,
    '{"sharp","pre-owned","electronics"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '6aedc061-861a-4f95-83b6-3335b2428ec5',
    'Apple Pre-Owned Apple Imac Screen Intel I5',
    'Excellent quality apple pre-owned apple imac screen intel i5 from Apple, powered by Intel i5. Perfect for home or office use.',
    'Computers & Electronics',
    'Grade B',
    'BW-APP-IMAC-2017-829',
    24900.0,
    'Apple',
    'iMac',
    2017,
    1,
    '{"/images/products/24900_pre-owned_apple_imac_27_screen_2017_intel_i5.jpg"}',
    '{"year": 2017, "processor": "Intel i5"}',
    '{"width": 25.6, "height": 20.3, "depth": 8.0}',
    20.5,
    'Warehouse A-1',
    3,
    '{"intel-i5","apple","year-2017","computers-electronics","pre-owned"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '6bc6420b-1b59-48be-8ef2-f12cb49a1da4',
    'Apple Imac All-In-One Desktop Computer',
    'Good working apple imac all-in-one desktop computer from Apple. Perfect for home or office use.',
    'Computers & Electronics',
    'Grade C',
    'BW-APP-IMAC-2019-441',
    39900.0,
    'Apple',
    'iMac',
    2019,
    1,
    '{"/images/products/39900_2019_apple_imac_all-in-one_desktop_computer.jpg"}',
    '{"year": 2019}',
    '{"width": 21.5, "height": 17.7, "depth": 6.9}',
    12.5,
    'Warehouse A-1',
    1,
    '{"year-2019","apple","computers-electronics"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '0073a806-9d14-406a-b335-de54a13cb90b',
    'Apple Imac Intel I9 36Ghz 32Gb Ram 1Tb',
    'Good working apple imac intel i9 36ghz 32gb ram 1tb from Apple, powered by Intel i9, with 32GB RAM, and 1TB storage. Perfect for home or office use.',
    'Computers & Electronics',
    'Grade C',
    'BW-APP-IMAC-2019-914',
    349.0,
    'Apple',
    'iMac',
    2019,
    1,
    '{"/images/products/349_apple_imac_27_2019_intel_i9_36ghz_32gb_ram_1tb.jpg"}',
    '{"year": 2019, "processor": "Intel i9", "ram": "32GB RAM", "storage": "1TB"}',
    '{"width": 25.6, "height": 20.3, "depth": 8.0}',
    20.5,
    'Warehouse A-1',
    1,
    '{"year-2019","apple","computers-electronics","intel-i9"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '0ccf93f3-c6fb-4cdb-8655-7b154f23b73d',
    'Home Theater Projectors New In Box Boomwarehous',
    'Excellent quality home theater projectors new in box boomwarehous . Perfect for home or office use.',
    'Electronics',
    'Grade A',
    'BW-UNK-GEN-421',
    25.0,
    NULL,
    NULL,
    NULL,
    1,
    '{"/images/products/25_home_theater_projectors_new_in_box_boomwarehous.jpg"}',
    '{}',
    NULL,
    NULL,
    'Warehouse A-1',
    3,
    '{"new","electronics"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '041280c0-14c2-41e7-ba54-22442461ac5f',
    'Like New Condition',
    'Excellent quality like new condition . Perfect for home or office use.',
    'General Merchandise',
    'Grade A',
    'BW-UNK-GEN-107',
    200.0,
    NULL,
    NULL,
    NULL,
    1,
    '{"/images/products/200_like_new_condition_boomwarehouse_4554_renaissa.jpg"}',
    '{}',
    NULL,
    NULL,
    'Warehouse A-1',
    3,
    '{"general-merchandise","new"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '5d584d16-1b19-49e1-bf5c-1d47b747e5cb',
    'Frigidaire New Frigidaire Gallery Cu Ft Refrigerator',
    'Excellent quality frigidaire new frigidaire gallery cu ft refrigerator from Frigidaire. Perfect for home or office use.',
    'Appliances',
    'Grade A',
    'BW-FRI-GEN-330',
    7900.0,
    'Frigidaire',
    NULL,
    NULL,
    1,
    '{"/images/products/7900_new_frigidaire_gallery_32_cu_ft_refrigerator.jpg"}',
    '{}',
    '{"width": 28.0, "height": 66.0, "depth": 32.0}',
    200.0,
    'Warehouse A-1',
    3,
    '{"appliances","new","frigidaire"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '5a8e8ed9-ae78-45ed-8c7a-39034817b880',
    'Frigidaire In Cooking Platepizza Maker Boom',
    'Excellent quality frigidaire in cooking platepizza maker boom from Frigidaire. Perfect for home or office use.',
    'Appliances',
    'Grade B',
    'BW-FRI-GEN-748',
    35.0,
    'Frigidaire',
    NULL,
    NULL,
    1,
    '{"/images/products/35_frigidaire_2_in_1_cooking_platepizza_maker_boom.jpg"}',
    '{}',
    NULL,
    NULL,
    'Warehouse A-1',
    3,
    '{"appliances","frigidaire"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '421b1325-990c-44a0-a719-45e3ce0cb7fe',
    'Apple Imac Intel I533Ghz 32Gb Ram 2Tb',
    'Excellent quality apple imac intel i533ghz 32gb ram 2tb from Apple, powered by Intel i5, with 32GB RAM, and 2TB storage. Perfect for home or office use.',
    'Computers & Electronics',
    'Grade B',
    'BW-APP-IMAC-2020-504',
    420.0,
    'Apple',
    'iMac',
    2020,
    1,
    '{"/images/products/420_apple_imac_27_2020_intel_i533ghz_32gb_ram_2tb.jpg"}',
    '{"year": 2020, "processor": "Intel i5", "ram": "32GB RAM", "storage": "2TB"}',
    '{"width": 25.6, "height": 20.3, "depth": 8.0}',
    20.5,
    'Warehouse A-1',
    3,
    '{"year-2020","apple","intel-i5","computers-electronics"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '3a4d6b25-2090-4c6a-9c65-25894d8819ad',
    'Apple Imacs Good Working Ready To Go Boomwareho',
    'Good working apple imacs good working ready to go boomwareho from Apple. Perfect for home or office use.',
    'Computers & Electronics',
    'Grade C',
    'BW-APP-IMAC-488',
    49.0,
    'Apple',
    'iMac',
    NULL,
    1,
    '{"/images/products/49_apple_imacs_good_working_ready_to_go_boomwareho.jpg"}',
    '{}',
    '{"width": 21.5, "height": 17.7, "depth": 6.9}',
    12.5,
    'Warehouse A-1',
    1,
    '{"apple","computers-electronics"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    'bf32dbaa-3b20-4d2c-b1ea-69b12fc336b8',
    'Christie Lw400 Lcd Projector',
    'Excellent quality christie lw400 lcd projector from Christie. Perfect for home or office use.',
    'Electronics',
    'Grade B',
    'BW-CHR-LW400-651',
    99.0,
    'Christie',
    'LW400',
    NULL,
    1,
    '{"/images/products/99_christie_lw400_lcd_projector_boomwarehouse_4554.jpg"}',
    '{}',
    NULL,
    NULL,
    'Warehouse A-1',
    3,
    '{"christie","electronics"}',
    true
);
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    'a5c50844-b5a6-4dff-a8b0-23169c4b39f9',
    'Mirror',
    'Excellent quality mirror . Perfect for home or office use.',
    'Home & Garden',
    'Grade B',
    'BW-UNK-GEN-674',
    50.0,
    NULL,
    NULL,
    NULL,
    1,
    '{"/images/products/50_mirror_boomwarehouse_4554_renaissance_pkwy_warr.jpg"}',
    '{}',
    NULL,
    NULL,
    'Warehouse A-1',
    3,
    '{"home-garden"}',
    true
);