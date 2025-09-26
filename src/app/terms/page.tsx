import { MainLayout } from '@/components/layout/main-layout'

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="container pl-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              <strong>Last updated:</strong> January 2024
            </p>

            <p className="mb-8">
              Welcome to Boom Warehouse. These Terms of Service ("Terms") govern your use of our website and services. By using our website or making a purchase, you agree to these terms.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
              <p>
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Definitions</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <ul className="space-y-2 text-sm">
                  <li><strong>"We," "Us," "Our"</strong> - Boom Warehouse</li>
                  <li><strong>"You," "Your"</strong> - The customer or website user</li>
                  <li><strong>"Services"</strong> - Our website, products, and customer service</li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 text-sm">
                  <li><strong>"Products"</strong> - Items available for purchase</li>
                  <li><strong>"Content"</strong> - Website text, images, and information</li>
                  <li><strong>"Account"</strong> - Your registered user account</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Use of Our Service</h2>

            <div className="space-y-6 mb-8">
              <div className="border-l-4 border-green-400 pl-6">
                <h3 className="text-lg font-semibold mb-2 text-green-600">Permitted Uses</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Browse and purchase products for personal or business use</li>
                  <li>• Create an account to track orders and preferences</li>
                  <li>• Contact us for customer service and support</li>
                  <li>• Leave reviews and feedback on purchased products</li>
                  <li>• Subscribe to newsletters and promotional communications</li>
                </ul>
              </div>

              <div className="border-l-4 border-red-400 pl-6">
                <h3 className="text-lg font-semibold mb-2 text-red-600">Prohibited Uses</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Use the service for any unlawful purpose or activity</li>
                  <li>• Attempt to gain unauthorized access to our systems</li>
                  <li>• Submit false or misleading information</li>
                  <li>• Interfere with or disrupt the service or servers</li>
                  <li>• Use automated tools to access or use the service</li>
                  <li>• Resell or redistribute our products without permission</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Account Terms</h2>

            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-3">Account Responsibilities</h3>
              <ul className="space-y-2 text-sm">
                <li>• You must be at least 18 years old to create an account</li>
                <li>• You must provide accurate and complete information</li>
                <li>• You are responsible for maintaining account security</li>
                <li>• You must notify us immediately of any unauthorized use</li>
                <li>• One account per person; multiple accounts may be suspended</li>
                <li>• You are responsible for all activities under your account</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Products and Pricing</h2>

            <div className="space-y-6 mb-8">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Product Descriptions</h3>
                <p className="text-sm mb-2">
                  We strive to provide accurate descriptions and images of all products. However:
                </p>
                <ul className="space-y-1 text-sm">
                  <li>• Product appearances may vary slightly from photos</li>
                  <li>• Specifications are based on manufacturer information</li>
                  <li>• "Refurbished" and "used" condition descriptions are provided in good faith</li>
                  <li>• We reserve the right to correct errors or update information</li>
                </ul>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Pricing and Availability</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Prices are subject to change without notice</li>
                  <li>• Product availability is not guaranteed until purchase confirmation</li>
                  <li>• We reserve the right to limit quantities</li>
                  <li>• Obvious pricing errors will be corrected before processing</li>
                  <li>• Tax may be added based on your location</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Orders and Payment</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold mb-3">Order Process</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Orders are subject to acceptance by us</li>
                  <li>• We may cancel orders for any reason</li>
                  <li>• Confirmation email confirms order acceptance</li>
                  <li>• Processing typically takes 1-2 business days</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Payment Terms</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Payment is due at time of order</li>
                  <li>• We accept major credit cards and PayPal</li>
                  <li>• Failed payments may result in order cancellation</li>
                  <li>• Refunds processed per our return policy</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Shipping and Delivery</h2>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <ul className="space-y-2 text-sm">
                <li>• Shipping times are estimates and not guaranteed</li>
                <li>• Risk of loss passes to buyer upon delivery</li>
                <li>• You must inspect items upon delivery</li>
                <li>• Report shipping damage within 48 hours</li>
                <li>• Delivery address changes may not be possible after processing</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Returns and Warranties</h2>

            <p className="mb-4">
              Returns and warranties are governed by our separate Return Policy and Warranty Policy, which are incorporated by reference into these Terms.
            </p>

            <div className="border-l-4 border-blue-400 pl-6 mb-8">
              <h3 className="font-semibold mb-2">Key Points:</h3>
              <ul className="space-y-1 text-sm">
                <li>• 30-day return window for most items</li>
                <li>• 30-90 day warranty depending on product type</li>
                <li>• Restocking fees may apply to some returns</li>
                <li>• Customer responsible for return shipping in some cases</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Intellectual Property</h2>

            <div className="space-y-4 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Our Content</h3>
                <p className="text-sm">All website content, including text, images, logos, and design, is owned by Boom Warehouse or licensed to us. You may not reproduce, distribute, or create derivative works without permission.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Your Content</h3>
                <p className="text-sm">When you submit reviews, comments, or other content, you grant us a non-exclusive right to use, reproduce, and display that content in connection with our services.</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Disclaimers and Limitations</h2>

            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
              <h3 className="font-semibold mb-3">Service Disclaimer</h3>
              <p className="text-sm mb-3">
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE." WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <p className="text-sm">
                We do not guarantee that our service will be uninterrupted, timely, secure, or error-free.
              </p>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold mb-3">Limitation of Liability</h3>
              <p className="text-sm mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR LIABILITY FOR ANY CLAIM RELATED TO OUR SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE PRODUCT OR SERVICE GIVING RISE TO THE CLAIM.
              </p>
              <p className="text-sm">
                We shall not be liable for indirect, incidental, special, or consequential damages.
              </p>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Indemnification</h2>
            <p className="mb-8 text-sm">
              You agree to indemnify and hold harmless Boom Warehouse from any claims, damages, or expenses arising from your use of our services, violation of these terms, or violation of any rights of another party.
            </p>

            <h2 className="text-2xl font-semibold mb-6">Governing Law</h2>
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <p className="text-sm">
                These Terms shall be governed by and construed in accordance with the laws of the State of Ohio, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Cuyahoga County, Ohio.
              </p>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Changes to Terms</h2>
            <p className="mb-8 text-sm">
              We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of our services after changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-semibold mb-6">Severability</h2>
            <p className="mb-8 text-sm">
              If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p><strong>Email:</strong> legal@boomwarehouse.com</p>
                  <p><strong>Phone:</strong> (216) 555-0123</p>
                  <p><strong>Hours:</strong> Mon-Fri 9AM-6PM</p>
                </div>
                <div>
                  <p><strong>Mail:</strong></p>
                  <p>Boom Warehouse<br/>
                  Legal Department<br/>
                  Warrensville Heights, OH</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}