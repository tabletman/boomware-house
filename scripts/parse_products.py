#!/usr/bin/env python3
"""
Product Parser for Boom Warehouse
Parses product information from image filenames and creates structured data
"""

import os
import re
import json
from typing import Dict, List, Optional, Tuple

class ProductParser:
    def __init__(self, images_dir: str):
        self.images_dir = images_dir
        self.products = []

        # Category mappings
        self.categories = {
            'imac': 'Computers & Electronics',
            'dell': 'Computers & Electronics',
            'frigidaire': 'Appliances',
            'sharp': 'Electronics',
            'projector': 'Electronics',
            'hitachi': 'Electronics',
            'christie': 'Electronics',
            'china': 'Home & Garden',
            'mikasa': 'Home & Garden',
            'basketball': 'Sports & Recreation',
            'art': 'Home & Garden',
            'mirror': 'Home & Garden',
            'speakers': 'Electronics'
        }

        # Condition mappings based on keywords and age
        self.condition_keywords = {
            'new': 'Grade A',
            'like new': 'Grade A',
            'pre-owned': 'Grade B',
            'good': 'Grade C',
            'working': 'Grade C'
        }

    def extract_price(self, filename: str) -> Optional[int]:
        """Extract price from filename (number at the start)"""
        match = re.match(r'^(\d+)_', filename)
        if match:
            return int(match.group(1))
        return None

    def determine_condition(self, filename: str, year: Optional[int] = None) -> str:
        """Determine product condition based on keywords and age"""
        filename_lower = filename.lower()

        # Check for explicit condition keywords
        for keyword, grade in self.condition_keywords.items():
            if keyword in filename_lower:
                return grade

        # Age-based condition for computers (if year is available)
        if year and 'imac' in filename_lower:
            current_year = 2025
            age = current_year - year
            if age <= 2:
                return 'Grade A'
            elif age <= 5:
                return 'Grade B'
            elif age <= 8:
                return 'Grade C'
            else:
                return 'Grade D'

        # Default to Grade B for most items
        return 'Grade B'

    def extract_specifications(self, filename: str) -> Dict:
        """Extract technical specifications from filename"""
        specs = {}
        filename_lower = filename.lower()

        # Screen size
        screen_match = re.search(r'(\d+)["\s]*screen|(\d+)"', filename_lower)
        if screen_match:
            specs['screen_size'] = f"{screen_match.group(1) or screen_match.group(2)} inches"

        # Year
        year_match = re.search(r'(20\d{2})', filename)
        if year_match:
            specs['year'] = int(year_match.group(1))

        # Processor
        if 'i3' in filename_lower:
            specs['processor'] = 'Intel i3'
        elif 'i5' in filename_lower:
            specs['processor'] = 'Intel i5'
        elif 'i7' in filename_lower:
            specs['processor'] = 'Intel i7'
        elif 'i9' in filename_lower:
            specs['processor'] = 'Intel i9'
        elif 'xeon' in filename_lower:
            specs['processor'] = 'Intel Xeon'

        # RAM
        ram_match = re.search(r'(\d+)gb.*ram', filename_lower)
        if ram_match:
            specs['ram'] = f"{ram_match.group(1)}GB RAM"

        # Storage
        storage_match = re.search(r'(\d+)tb|(\d+)gb.*storage', filename_lower)
        if storage_match:
            if storage_match.group(1):
                specs['storage'] = f"{storage_match.group(1)}TB"
            elif storage_match.group(2):
                specs['storage'] = f"{storage_match.group(2)}GB"

        # Refrigerator capacity
        capacity_match = re.search(r'(\d+\.?\d*)\s*cu\s*ft', filename_lower)
        if capacity_match:
            specs['capacity'] = f"{capacity_match.group(1)} cu ft"

        # Projector lumens
        lumens_match = re.search(r'(\d+)\s*lumens', filename_lower)
        if lumens_match:
            specs['lumens'] = f"{lumens_match.group(1)} lumens"

        return specs

    def determine_category(self, filename: str) -> str:
        """Determine product category from filename"""
        filename_lower = filename.lower()

        for keyword, category in self.categories.items():
            if keyword in filename_lower:
                return category

        # Default category
        return 'General Merchandise'

    def extract_brand_and_model(self, filename: str) -> Tuple[Optional[str], Optional[str]]:
        """Extract brand and model from filename"""
        filename_lower = filename.lower()

        # Brand extraction
        brands = {
            'apple': 'Apple',
            'dell': 'Dell',
            'frigidaire': 'Frigidaire',
            'sharp': 'Sharp',
            'hitachi': 'Hitachi',
            'christie': 'Christie',
            'mikasa': 'Mikasa',
            'excel': 'Excel'
        }

        brand = None
        for brand_key, brand_name in brands.items():
            if brand_key in filename_lower:
                brand = brand_name
                break

        # Model extraction
        model = None
        if 'imac' in filename_lower:
            model = 'iMac'
        elif 'cp-wx625' in filename_lower:
            model = 'CP-WX625'
        elif 'lw400' in filename_lower:
            model = 'LW400'
        elif 'lc-60l' in filename_lower:
            model = 'LC-60LE650U'
        elif 'aquos' in filename_lower:
            model = 'Aquos LED TV'

        return brand, model

    def generate_description(self, name: str, specs: Dict, condition: str, brand: str = None) -> str:
        """Generate product description based on specifications"""
        desc_parts = []

        if condition in ['Grade A', 'Grade B']:
            desc_parts.append(f"Excellent quality {name.lower()}")
        else:
            desc_parts.append(f"Good working {name.lower()}")

        if brand:
            desc_parts.append(f"from {brand}")

        # Add key specifications
        if 'screen_size' in specs:
            desc_parts.append(f"featuring a {specs['screen_size']} display")

        if 'processor' in specs:
            desc_parts.append(f"powered by {specs['processor']}")

        if 'ram' in specs:
            desc_parts.append(f"with {specs['ram']}")

        if 'storage' in specs:
            desc_parts.append(f"and {specs['storage']} storage")

        if 'capacity' in specs:
            desc_parts.append(f"with {specs['capacity']} capacity")

        if 'lumens' in specs:
            desc_parts.append(f"delivering {specs['lumens']}")

        desc_parts.append("Perfect for home or office use.")

        return ". ".join(desc_parts[0:1]) + " " + ", ".join(desc_parts[1:-1]) + ". " + desc_parts[-1]

    def generate_sku(self, brand: str, model: str, specs: Dict) -> str:
        """Generate SKU for product"""
        sku_parts = ['BW']  # Boom Warehouse prefix

        if brand:
            sku_parts.append(brand[:3].upper())

        if model:
            sku_parts.append(re.sub(r'[^A-Z0-9]', '', model.upper())[:6])

        if 'year' in specs:
            sku_parts.append(str(specs['year']))

        # Add random suffix to ensure uniqueness
        import random
        sku_parts.append(f"{random.randint(100, 999):03d}")

        return "-".join(sku_parts)

    def parse_filename(self, filename: str) -> Optional[Dict]:
        """Parse a single filename into product data"""
        # Skip non-product images
        if any(skip in filename.lower() for skip in ['free', 'profile', 'avatar']):
            return None

        price = self.extract_price(filename)
        if not price:
            return None

        specs = self.extract_specifications(filename)
        brand, model = self.extract_brand_and_model(filename)
        category = self.determine_category(filename)
        condition = self.determine_condition(filename, specs.get('year'))

        # Generate product name from filename
        name_parts = filename.replace('.jpg', '').split('_')[1:]  # Skip price part
        name = ' '.join([part.title() for part in name_parts if not part.isdigit()])
        name = re.sub(r'\s+', ' ', name).strip()

        # Clean up name
        name = re.sub(r'Boomwarehouse.*', '', name, flags=re.IGNORECASE).strip()
        if brand and not name.startswith(brand):
            name = f"{brand} {name}"

        sku = self.generate_sku(brand or 'UNK', model or 'GEN', specs)
        description = self.generate_description(name, specs, condition, brand)

        # Determine dimensions and weight estimates
        dimensions = {}
        weight = None

        if 'imac' in filename.lower():
            if '27' in filename:
                dimensions = {"width": 25.6, "height": 20.3, "depth": 8.0}
                weight = 20.5
            else:
                dimensions = {"width": 21.5, "height": 17.7, "depth": 6.9}
                weight = 12.5
        elif 'refrigerator' in filename.lower():
            if 'mini' in filename.lower():
                dimensions = {"width": 17.7, "height": 19.4, "depth": 18.6}
                weight = 40.0
            else:
                dimensions = {"width": 28.0, "height": 66.0, "depth": 32.0}
                weight = 200.0

        return {
            'name': name,
            'description': description,
            'category': category,
            'condition': condition,
            'sku': sku,
            'price': float(price),
            'brand': brand,
            'model': model,
            'year': specs.get('year'),
            'specifications': specs,
            'dimensions': dimensions if dimensions else None,
            'weight': weight,
            'quantity': 1,  # Assuming 1 of each item
            'images': [f"/images/products/{filename}"],
            'tags': self.generate_tags(name, category, brand, specs),
            'location': 'Warehouse A-1',
            'warranty_months': 3 if condition in ['Grade A', 'Grade B'] else 1
        }

    def generate_tags(self, name: str, category: str, brand: str, specs: Dict) -> List[str]:
        """Generate tags for product"""
        tags = []

        if brand:
            tags.append(brand.lower())

        tags.append(category.lower().replace(' & ', '-').replace(' ', '-'))

        # Add condition-based tags
        if 'pre-owned' in name.lower():
            tags.append('pre-owned')
        if 'new' in name.lower():
            tags.append('new')

        # Add specification tags
        if specs.get('year'):
            tags.append(f"year-{specs['year']}")

        if 'processor' in specs:
            tags.append(specs['processor'].lower().replace(' ', '-'))

        return list(set(tags))

    def parse_all_products(self) -> List[Dict]:
        """Parse all product images in the directory"""
        if not os.path.exists(self.images_dir):
            raise FileNotFoundError(f"Images directory not found: {self.images_dir}")

        products = []
        for filename in os.listdir(self.images_dir):
            if filename.lower().endswith('.jpg'):
                product = self.parse_filename(filename)
                if product:
                    products.append(product)

        return products

def main():
    images_dir = "/Users/bp/projects/_active/boom/boom-warehouse/public/images/products"
    parser = ProductParser(images_dir)

    try:
        products = parser.parse_all_products()
        print(f"Parsed {len(products)} products")

        # Save to JSON file for review
        output_file = "/Users/bp/projects/_active/boom/boom-warehouse/data/parsed_products.json"
        with open(output_file, 'w') as f:
            json.dump(products, f, indent=2, default=str)

        print(f"Products saved to {output_file}")

        # Print summary
        categories = {}
        conditions = {}
        for product in products:
            cat = product['category']
            cond = product['condition']
            categories[cat] = categories.get(cat, 0) + 1
            conditions[cond] = conditions.get(cond, 0) + 1

        print("\nCategory breakdown:")
        for cat, count in categories.items():
            print(f"  {cat}: {count}")

        print("\nCondition breakdown:")
        for cond, count in conditions.items():
            print(f"  {cond}: {count}")

        return products

    except Exception as e:
        print(f"Error parsing products: {e}")
        return []

if __name__ == "__main__":
    main()