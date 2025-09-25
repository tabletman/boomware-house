#!/usr/bin/env python3
"""
Generate SQL insert statements for Boom Warehouse products
"""

import json
import uuid

def generate_product_inserts():
    # Load parsed products
    with open('/Users/bp/projects/_active/boom/boom-warehouse/data/parsed_products.json', 'r') as f:
        products = json.load(f)

    sql_statements = []

    # Generate product inserts
    for product in products:
        product_id = str(uuid.uuid4())

        # Clean up name and description
        name = product['name'].replace("'", "''")
        description = product['description'].replace("'", "''")

        # Format arrays for PostgreSQL
        images_array = '{' + ','.join(f'"{img}"' for img in product['images']) + '}'
        tags_array = '{' + ','.join(f'"{tag}"' for tag in product['tags']) + '}'

        # Format specifications as JSONB
        specs_json = json.dumps(product['specifications']).replace("'", "''")

        # Format dimensions as JSONB if available
        dimensions_json = 'NULL'
        if product['dimensions']:
            dimensions_json = "'" + json.dumps(product['dimensions']).replace("'", "''") + "'"

        # Create insert statement
        insert_sql = f"""
INSERT INTO products (
    id, name, description, category, condition, sku, price,
    brand, model, year, quantity, images, specifications,
    dimensions, weight, location, warranty_months, tags, is_active
) VALUES (
    '{product_id}',
    '{name}',
    '{description}',
    '{product['category']}',
    '{product['condition']}',
    '{product['sku']}',
    {product['price']},
    {f"'{product['brand']}'" if product['brand'] else 'NULL'},
    {f"'{product['model']}'" if product['model'] else 'NULL'},
    {product['year'] if product['year'] else 'NULL'},
    {product['quantity']},
    '{images_array}',
    '{specs_json}',
    {dimensions_json},
    {product['weight'] if product['weight'] else 'NULL'},
    '{product['location']}',
    {product['warranty_months']},
    '{tags_array}',
    true
);"""

        sql_statements.append(insert_sql)

    return sql_statements

def generate_categories_inserts():
    """Generate category inserts"""
    categories = [
        {
            'id': str(uuid.uuid4()),
            'name': 'Computers & Electronics',
            'slug': 'computers-electronics',
            'description': 'Desktop computers, iMacs, and electronic devices'
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Appliances',
            'slug': 'appliances',
            'description': 'Refrigerators, kitchen appliances, and home appliances'
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Electronics',
            'slug': 'electronics',
            'description': 'TVs, projectors, speakers, and electronic accessories'
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Home & Garden',
            'slug': 'home-garden',
            'description': 'China sets, mirrors, home decor, and garden items'
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Sports & Recreation',
            'slug': 'sports-recreation',
            'description': 'Sports equipment and recreational items'
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'General Merchandise',
            'slug': 'general-merchandise',
            'description': 'Miscellaneous items and general products'
        }
    ]

    sql_statements = []
    for category in categories:
        insert_sql = f"""
INSERT INTO categories (
    id, name, slug, description, is_active
) VALUES (
    '{category['id']}',
    '{category['name']}',
    '{category['slug']}',
    '{category['description']}',
    true
);"""
        sql_statements.append(insert_sql)

    return sql_statements

def main():
    print("Generating SQL insert statements...")

    # Generate category inserts
    category_inserts = generate_categories_inserts()
    print(f"Generated {len(category_inserts)} category inserts")

    # Generate product inserts
    product_inserts = generate_product_inserts()
    print(f"Generated {len(product_inserts)} product inserts")

    # Combine all SQL statements
    all_sql = category_inserts + product_inserts

    # Write to file
    output_file = '/Users/bp/projects/_active/boom/boom-warehouse/data/insert_products.sql'
    with open(output_file, 'w') as f:
        f.write("-- Insert categories\n")
        f.write("".join(category_inserts))
        f.write("\n-- Insert products\n")
        f.write("".join(product_inserts))

    print(f"SQL statements written to {output_file}")

if __name__ == "__main__":
    main()