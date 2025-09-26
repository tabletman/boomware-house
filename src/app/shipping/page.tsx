import { MainLayout } from '@/components/layout/main-layout'

export default function ShippingPage() {
  return (
    <MainLayout>
      <div className="container pl-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Shipping Information</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              Fast, reliable shipping options to get your electronics to you safely.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-blue-800">Local Delivery</h2>
                <div className="space-y-2 text-blue-700">
                  <p><strong>Coverage:</strong> Cleveland Metro Area</p>
                  <p><strong>Cost:</strong> $15 - $25 depending on distance</p>
                  <p><strong>Time:</strong> Same day or next day</p>
                  <p><strong>Special:</strong> Free delivery on orders over $500</p>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-green-800">In-Store Pickup</h2>
                <div className="space-y-2 text-green-700">
                  <p><strong>Cost:</strong> FREE</p>
                  <p><strong>Time:</strong> Ready within 2 hours</p>
                  <p><strong>Benefits:</strong> Test before you take</p>
                  <p><strong>Hours:</strong> Mon-Fri 9AM-7PM, Sat 10AM-6PM, Sun 12PM-5PM</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Shipping Rates & Options</h2>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left">Shipping Method</th>
                    <th className="border border-gray-300 p-3 text-left">Time</th>
                    <th className="border border-gray-300 p-3 text-left">Cost</th>
                    <th className="border border-gray-300 p-3 text-left">Tracking</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3">Standard Ground</td>
                    <td className="border border-gray-300 p-3">5-7 business days</td>
                    <td className="border border-gray-300 p-3">$8.99 - $15.99</td>
                    <td className="border border-gray-300 p-3">Yes</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-3">Expedited</td>
                    <td className="border border-gray-300 p-3">3-4 business days</td>
                    <td className="border border-gray-300 p-3">$15.99 - $25.99</td>
                    <td className="border border-gray-300 p-3">Yes</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3">Express</td>
                    <td className="border border-gray-300 p-3">1-2 business days</td>
                    <td className="border border-gray-300 p-3">$25.99 - $45.99</td>
                    <td className="border border-gray-300 p-3">Yes</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-3">Freight (Large Items)</td>
                    <td className="border border-gray-300 p-3">7-14 business days</td>
                    <td className="border border-gray-300 p-3">Quote upon request</td>
                    <td className="border border-gray-300 p-3">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Important Shipping Notes</h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">•</span>
                <p><strong>Free shipping</strong> on orders over $200 (standard ground shipping)</p>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">•</span>
                <p><strong>Processing time:</strong> 1-2 business days before shipping</p>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">•</span>
                <p><strong>Large items</strong> (TVs, appliances) require freight shipping and may need appointment delivery</p>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">•</span>
                <p><strong>Packaging:</strong> All items are professionally packaged with protective materials</p>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">•</span>
                <p><strong>Insurance:</strong> All shipments are insured against damage or loss</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <h3 className="font-semibold mb-2">Shipping Address Important!</h3>
              <p>Please ensure your shipping address is complete and correct. We cannot be responsible for packages delivered to incorrect addresses. PO Boxes are not accepted for large electronics.</p>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Order Tracking</h2>
            <p className="mb-4">
              Once your order ships, you'll receive a tracking number via email. You can track your package directly through our carrier partners or contact us for updates.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Questions about shipping?</h3>
              <p className="mb-2">Contact our customer service team:</p>
              <p>📧 Email: shipping@boomwarehouse.com</p>
              <p>📞 Phone: (216) 555-0123</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}