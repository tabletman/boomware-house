import { MainLayout } from '@/components/layout/main-layout'

export default function FAQPage() {
  return (
    <MainLayout>
      <div className="container pl-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              Find answers to common questions about shopping at Boom Warehouse.
            </p>

            <div className="space-y-8">
              {/* General Questions */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-blue-600">General Questions</h2>

                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">What types of items do you sell?</h3>
                    <p className="text-gray-700">
                      We specialize in refurbished and used electronics including computers, laptops, monitors, mobile devices, gaming consoles, computer parts, and home appliances. All items are thoroughly inspected and tested before sale.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Are your products reliable?</h3>
                    <p className="text-gray-700">
                      Yes! Every item goes through our rigorous inspection and testing process. We only sell items that meet our high quality standards, and we back them with our warranty. Many customers find our refurbished items work just as well as new products.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Do you offer pickup and delivery?</h3>
                    <p className="text-gray-700">
                      Yes! We offer free in-store pickup and local delivery throughout the Cleveland metro area. Delivery fees range from $15-25 depending on distance, with free delivery on orders over $500.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Can I test items before buying?</h3>
                    <p className="text-gray-700">
                      Absolutely! We encourage customers to test items in our store before purchase. For pickup orders, you can test the item when you arrive to ensure it meets your expectations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchasing & Payment */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-green-600">Purchasing & Payment</h2>

                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                    <p className="text-gray-700">
                      We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, cash (for in-store purchases), and certified checks.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Do you offer financing?</h3>
                    <p className="text-gray-700">
                      Currently we do not offer in-house financing, but many customers use PayPal Pay in 4 or their credit card's payment plans for larger purchases.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Can I negotiate prices?</h3>
                    <p className="text-gray-700">
                      Our prices are already competitive, but we may consider reasonable offers on higher-priced items or bulk purchases. Contact us to discuss.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Do you price match?</h3>
                    <p className="text-gray-700">
                      We'll consider price matching comparable items from local competitors. The item must be the same model, condition, and include the same accessories or warranty.
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping & Returns */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-purple-600">Shipping & Returns</h2>

                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">How much does shipping cost?</h3>
                    <p className="text-gray-700">
                      Shipping starts at $8.99 for standard ground (5-7 days). Express shipping is available for $25.99-45.99. Free shipping on orders over $200!
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Can I return items if I don't like them?</h3>
                    <p className="text-gray-700">
                      Yes! We offer 30-day returns on most items. Returns due to change of mind include a 15% restocking fee and customer pays return shipping. Items that don't match description or arrive defective get full refunds.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">What if an item breaks after purchase?</h3>
                    <p className="text-gray-700">
                      All items come with our warranty (30-90 days depending on item type). If something breaks due to a defect or normal wear, we'll repair or replace it at no charge during the warranty period.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">How do I start a return or warranty claim?</h3>
                    <p className="text-gray-700">
                      Contact us by phone (216) 555-0123 or email (info@boomwarehouse.com) with your order number and description of the issue. We'll provide return instructions and an RMA number.
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Support */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-orange-600">Technical Support</h2>

                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Do you provide tech support?</h3>
                    <p className="text-gray-700">
                      Yes! We offer basic technical support for items purchased from us. This includes setup assistance, troubleshooting hardware issues, and helping with driver installations.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Do your computers come with operating systems?</h3>
                    <p className="text-gray-700">
                      Most of our computers come with a clean installation of Windows 10 or 11 (depending on hardware compatibility). Some may come with Linux. We can install specific OS versions for an additional fee.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Can you upgrade or modify items?</h3>
                    <p className="text-gray-700">
                      Yes! We offer upgrade services for computers including RAM, storage, and graphics cards. Contact us for pricing and availability. Upgrades may affect warranty terms.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">What if I need cables or accessories?</h3>
                    <p className="text-gray-700">
                      We stock common cables and accessories. If an item needs specific cables that aren't included, we'll let you know before purchase and can often provide them at cost.
                    </p>
                  </div>
                </div>
              </div>

              {/* Business & Bulk Orders */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-red-600">Business & Bulk Orders</h2>

                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Do you work with businesses?</h3>
                    <p className="text-gray-700">
                      Absolutely! We work with schools, small businesses, nonprofits, and other organizations. We offer volume discounts and can help source specific equipment.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Do you offer bulk pricing?</h3>
                    <p className="text-gray-700">
                      Yes, we offer discounts on purchases of 5+ similar items. Contact us with your requirements for a custom quote.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Can you source specific items?</h3>
                    <p className="text-gray-700">
                      We can often source specific models or configurations for businesses. Lead times vary, but we'll work to find what you need at competitive prices.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg mt-12">
              <h2 className="text-2xl font-semibold mb-4">Still Have Questions?</h2>
              <p className="mb-6">
                Can't find the answer you're looking for? Our friendly customer service team is here to help!
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">📞 Phone</h3>
                  <p>(216) 555-0123</p>
                  <p className="text-sm text-gray-600">Mon-Fri 9AM-7PM</p>
                </div>

                <div className="text-center">
                  <h3 className="font-semibold mb-2">📧 Email</h3>
                  <p>info@boomwarehouse.com</p>
                  <p className="text-sm text-gray-600">24-48 hour response</p>
                </div>

                <div className="text-center">
                  <h3 className="font-semibold mb-2">🏪 In Store</h3>
                  <p>Warrensville Heights, OH</p>
                  <p className="text-sm text-gray-600">Test before you buy!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}