import { MainLayout } from '@/components/layout/main-layout'

export default function AccountPage() {
  return (
    <MainLayout>
      <div className="container pl-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Account</h1>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Account Features Coming Soon</h2>
              <p>
                We're working on bringing you a full-featured account dashboard. In the meantime,
                please contact us directly for any account-related needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-semibold mb-4">What You'll Be Able To Do</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Track your order status and shipping
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    View your purchase history
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Manage your shipping addresses
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Save items to your wishlist
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Start warranty claims and returns
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Manage email preferences
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Current Services Available</h2>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">📧 Email Updates</h3>
                    <p className="text-sm text-gray-600">We'll send order confirmations and shipping notifications to your email address.</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">📞 Phone Support</h3>
                    <p className="text-sm text-gray-600">Call us for order status, returns, and any questions about your purchases.</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">🏪 In-Store Service</h3>
                    <p className="text-sm text-gray-600">Visit our location for in-person assistance with orders, returns, and warranty claims.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold mb-4">Need Help Now?</h2>
              <p className="mb-6">
                Our customer service team is here to help with all your account needs until our online dashboard is ready.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">📞 Call Us</h3>
                  <p className="text-lg font-semibold text-blue-600">(216) 555-0123</p>
                  <p className="text-sm text-gray-600">Mon-Fri 9AM-7PM</p>
                  <p className="text-sm text-gray-600">Sat 10AM-6PM, Sun 12PM-5PM</p>
                </div>

                <div className="text-center">
                  <h3 className="font-semibold mb-2">📧 Email Us</h3>
                  <p className="text-sm">
                    <strong>General:</strong> info@boomwarehouse.com<br/>
                    <strong>Orders:</strong> orders@boomwarehouse.com<br/>
                    <strong>Returns:</strong> returns@boomwarehouse.com
                  </p>
                  <p className="text-sm text-gray-600">24-48 hour response</p>
                </div>

                <div className="text-center">
                  <h3 className="font-semibold mb-2">🏪 Visit Us</h3>
                  <p className="text-sm">
                    Warrensville Heights, OH<br/>
                    Cleveland Metro Area
                  </p>
                  <p className="text-sm text-gray-600">Test products before you buy!</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-green-800">For Existing Customers</h3>
                <p className="text-sm mb-3">Already made a purchase? We can help you with:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Order status and tracking information</li>
                  <li>• Returns and warranty claims</li>
                  <li>• Receipt reprints and order history</li>
                  <li>• Technical support for purchased items</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-blue-800">For New Customers</h3>
                <p className="text-sm mb-3">New to Boom Warehouse? We can help with:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Product recommendations and availability</li>
                  <li>• Shipping options and delivery areas</li>
                  <li>• Warranty and return policy questions</li>
                  <li>• Special orders and bulk pricing</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
              <h3 className="font-semibold mb-2">Newsletter Signup</h3>
              <p className="text-sm mb-4">
                Stay updated on new arrivals, special deals, and when our account features launch!
              </p>
              <p className="text-sm">
                <strong>Email us at info@boomwarehouse.com</strong> with "Newsletter" in the subject line
                to join our mailing list.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}