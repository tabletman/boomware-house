import { MainLayout } from '@/components/layout/main-layout'

export default function WarrantyPage() {
  return (
    <MainLayout>
      <div className="container pl-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Warranty Information</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              We stand behind the quality of our refurbished electronics with comprehensive warranty coverage.
            </p>

            <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-green-800">Standard Warranty Coverage</h2>
              <div className="grid md:grid-cols-2 gap-4 text-green-700">
                <div>
                  <p><strong>Electronics & Computers:</strong> 90 days</p>
                  <p><strong>Mobile Devices:</strong> 60 days</p>
                  <p><strong>Appliances:</strong> 90 days</p>
                </div>
                <div>
                  <p><strong>Gaming Consoles:</strong> 90 days</p>
                  <p><strong>Accessories:</strong> 30 days</p>
                  <p><strong>Parts & Components:</strong> 60 days</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">What's Covered</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-green-600">✅ Covered Issues</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Hardware failures and defects
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Power supply issues
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Screen and display problems
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Keyboard and input device failures
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Battery issues (where applicable)
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Manufacturing defects
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-600">❌ Not Covered</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    Physical damage from drops or spills
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    Software issues or virus infections
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    Cosmetic wear and normal usage marks
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    Damage from unauthorized repairs
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    Water damage or environmental damage
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    Lost or stolen items
                  </li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Warranty Process</h2>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Contact Us</h3>
                <p className="text-sm text-gray-600">Report the issue within warranty period</p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Diagnosis</h3>
                <p className="text-sm text-gray-600">We'll help troubleshoot or request return</p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Repair/Replace</h3>
                <p className="text-sm text-gray-600">We'll fix or replace the defective item</p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">4</span>
                </div>
                <h3 className="font-semibold mb-2">Return</h3>
                <p className="text-sm text-gray-600">Get your working device back</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Extended Warranty Options</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">1-Year Extended</h3>
                <p className="text-gray-600 mb-4">Extend coverage to a full year from purchase date</p>
                <ul className="space-y-2 text-sm">
                  <li>• Available for computers and electronics over $300</li>
                  <li>• Covers same issues as standard warranty</li>
                  <li>• Must be purchased within 30 days of original purchase</li>
                  <li>• Cost: 15% of item price</li>
                </ul>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-purple-600">Accident Protection</h3>
                <p className="text-gray-600 mb-4">Covers accidental damage and spills</p>
                <ul className="space-y-2 text-sm">
                  <li>• Available for laptops and mobile devices</li>
                  <li>• Covers drops, spills, and impact damage</li>
                  <li>• 2 claims per year maximum</li>
                  <li>• Cost: 20% of item price</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
              <h3 className="font-semibold mb-2">Important Warranty Notes</h3>
              <ul className="space-y-2 text-sm">
                <li>• Warranty begins from the date of delivery</li>
                <li>• Keep your receipt - it's required for warranty service</li>
                <li>• We may repair, replace, or provide store credit (your choice)</li>
                <li>• Warranty covers parts and labor at no charge</li>
                <li>• Some items may have manufacturer warranty that exceeds ours</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Manufacturer Warranties</h2>
            <p className="mb-4">
              Some items may still be covered under the original manufacturer's warranty. We'll help you determine if manufacturer warranty applies and assist with claims when possible.
            </p>

            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold mb-3">Items with Possible Manufacturer Coverage</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <ul className="space-y-1">
                  <li>• Recent model computers (under 3 years old)</li>
                  <li>• Gaming consoles and controllers</li>
                  <li>• Brand name monitors and displays</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Professional audio/video equipment</li>
                  <li>• Network equipment and routers</li>
                  <li>• Some mobile devices and tablets</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Need Warranty Service?</h2>
              <p className="mb-4">
                Contact our warranty department for fast, friendly service.
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> warranty@boomwarehouse.com</p>
                <p><strong>Phone:</strong> (216) 555-0123</p>
                <p><strong>Hours:</strong> Mon-Fri 9AM-6PM</p>
              </div>
              <div className="mt-4 p-4 bg-white rounded border">
                <p className="text-sm"><strong>When contacting us, please have ready:</strong></p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Order number or receipt</li>
                  <li>• Item model and serial number</li>
                  <li>• Description of the problem</li>
                  <li>• Photos of the issue (if applicable)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}