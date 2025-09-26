import { MainLayout } from '@/components/layout/main-layout'

export default function ReturnsPage() {
  return (
    <MainLayout>
      <div className="container pl-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Returns & Exchanges</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              We stand behind our products. If you're not satisfied, we'll make it right.
            </p>

            <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-green-800">Our Return Policy</h2>
              <div className="text-green-700 space-y-2">
                <p><strong>Return Window:</strong> 30 days from delivery date</p>
                <p><strong>Condition:</strong> Items must be in original condition</p>
                <p><strong>Packaging:</strong> Original packaging preferred (not required)</p>
                <p><strong>Testing Period:</strong> 7 days to test functionality</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Return Process</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Contact Us</h3>
                <p className="text-sm text-gray-600">Call or email within 30 days to start your return</p>
              </div>

              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Get RMA Number</h3>
                <p className="text-sm text-gray-600">We'll provide a Return Authorization number and instructions</p>
              </div>

              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Ship Back</h3>
                <p className="text-sm text-gray-600">Package securely and ship with tracking</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Return Categories</h2>

            <div className="space-y-6 mb-8">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-green-600">✅ Full Refund Returns</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Item doesn't match description</li>
                  <li>• Defective upon arrival (within 7 days)</li>
                  <li>• Item damaged during shipping</li>
                  <li>• Wrong item sent</li>
                </ul>
                <p className="mt-3 text-sm text-gray-600">
                  <strong>Refund processing:</strong> 3-5 business days after we receive the item
                </p>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-600">⚠️ Restocking Fee Returns</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Changed mind on purchase</li>
                  <li>• Item works but doesn't meet expectations</li>
                  <li>• Cosmetic issues not disclosed (minor)</li>
                </ul>
                <p className="mt-3 text-sm text-gray-600">
                  <strong>Restocking fee:</strong> 15% of purchase price<br/>
                  <strong>Customer pays return shipping</strong>
                </p>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-red-600">❌ Non-Returnable Items</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Items damaged by customer</li>
                  <li>• Software and digital downloads</li>
                  <li>• Items returned after 30 days</li>
                  <li>• Items missing accessories or cables</li>
                  <li>• Custom or modified items</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Exchange Policy</h2>

            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold mb-3">Direct Exchanges Available</h3>
              <p className="mb-3">
                If you'd like to exchange for a different model or size, we can arrange a direct exchange within 30 days of purchase.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Same category items (computer for computer)
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Price difference applies (refund or additional payment)
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  No restocking fee for even exchanges
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Warranty vs Returns</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Returns (30 days)</h3>
                <ul className="text-sm space-y-1">
                  <li>• Don't like the item</li>
                  <li>• Changed your mind</li>
                  <li>• Item not as expected</li>
                  <li>• Immediate defects</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Warranty (90 days)</h3>
                <ul className="text-sm space-y-1">
                  <li>• Item stops working</li>
                  <li>• Hardware failure</li>
                  <li>• Manufacturing defect</li>
                  <li>• Normal wear issues</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
              <p className="mb-4">
                Our customer service team is here to help with any return or exchange questions.
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> returns@boomwarehouse.com</p>
                <p><strong>Phone:</strong> (216) 555-0123</p>
                <p><strong>Hours:</strong> Mon-Fri 9AM-7PM, Sat 10AM-6PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}