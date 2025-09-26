import { MainLayout } from '@/components/layout/main-layout'

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="container pl-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              <strong>Last updated:</strong> January 2024
            </p>

            <p className="mb-8">
              At Boom Warehouse, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.
            </p>

            <h2 className="text-2xl font-semibold mb-6">Information We Collect</h2>

            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
              <p className="mb-3">We may collect the following personal information when you:</p>
              <ul className="space-y-2">
                <li>• <strong>Make a purchase:</strong> Name, email, phone number, billing and shipping addresses</li>
                <li>• <strong>Create an account:</strong> Email address, password, preferences</li>
                <li>• <strong>Contact us:</strong> Name, email, phone number, message content</li>
                <li>• <strong>Subscribe to newsletters:</strong> Email address, communication preferences</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Automatically Collected Information</h3>
              <ul className="space-y-2">
                <li>• <strong>Website usage:</strong> Pages visited, time spent, browser type</li>
                <li>• <strong>Device information:</strong> IP address, device type, operating system</li>
                <li>• <strong>Cookies:</strong> Small files that help improve your experience</li>
                <li>• <strong>Analytics data:</strong> Aggregated usage statistics</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-6">How We Use Your Information</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">Primary Uses</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Process and fulfill your orders</li>
                  <li>• Provide customer service and support</li>
                  <li>• Send order confirmations and updates</li>
                  <li>• Handle returns and warranty claims</li>
                  <li>• Improve our website and services</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-600">Secondary Uses</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Send promotional emails (with consent)</li>
                  <li>• Recommend products based on interests</li>
                  <li>• Analyze website usage and performance</li>
                  <li>• Prevent fraud and ensure security</li>
                  <li>• Comply with legal obligations</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Information Sharing</h2>

            <div className="space-y-6 mb-8">
              <div className="border-l-4 border-green-400 pl-6">
                <h3 className="text-lg font-semibold mb-2">We DO share information with:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Payment processors</strong> (to process transactions securely)</li>
                  <li>• <strong>Shipping companies</strong> (to deliver your orders)</li>
                  <li>• <strong>Service providers</strong> (who help us operate our business)</li>
                  <li>• <strong>Legal authorities</strong> (when required by law)</li>
                </ul>
              </div>

              <div className="border-l-4 border-red-400 pl-6">
                <h3 className="text-lg font-semibold mb-2">We DO NOT:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Sell your personal information to third parties</li>
                  <li>• Share your information for marketing by others</li>
                  <li>• Give access to your data without proper safeguards</li>
                  <li>• Use your information for purposes other than stated here</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Cookies and Tracking</h2>

            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-3">Types of Cookies We Use</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Essential Cookies</strong></p>
                  <p>Required for basic website functionality, shopping cart, and checkout process.</p>
                </div>
                <div>
                  <p><strong>Analytics Cookies</strong></p>
                  <p>Help us understand how visitors use our website to improve user experience.</p>
                </div>
                <div>
                  <p><strong>Marketing Cookies</strong></p>
                  <p>Used to show relevant ads and measure marketing campaign effectiveness.</p>
                </div>
                <div>
                  <p><strong>Preference Cookies</strong></p>
                  <p>Remember your settings and preferences for future visits.</p>
                </div>
              </div>
              <p className="mt-4 text-sm">
                <strong>Managing Cookies:</strong> You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.
              </p>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Data Security</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Security Measures</h3>
                <ul className="space-y-2 text-sm">
                  <li>• SSL encryption for data transmission</li>
                  <li>• Secure payment processing systems</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Limited employee access to personal data</li>
                  <li>• Secure data storage and backup systems</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Your Security Role</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Use strong, unique passwords</li>
                  <li>• Log out of accounts on shared devices</li>
                  <li>• Keep your contact information updated</li>
                  <li>• Report suspicious account activity</li>
                  <li>• Review your orders and statements regularly</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Your Rights and Choices</h2>

            <div className="space-y-4 mb-8">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Access and Update</h3>
                <p className="text-sm">You can access and update your account information at any time through your account dashboard or by contacting us.</p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Email Communications</h3>
                <p className="text-sm">You can unsubscribe from marketing emails at any time using the unsubscribe link or by contacting us. We'll still send order-related emails.</p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Data Deletion</h3>
                <p className="text-sm">You can request deletion of your personal data. We may need to retain certain information for legal or business purposes.</p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Data Portability</h3>
                <p className="text-sm">You can request a copy of your personal data in a structured, commonly used format.</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Children's Privacy</h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
              <p>
                Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Changes to This Policy</h2>
            <p className="mb-6">
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We'll post the updated policy on this page and update the "Last updated" date. For significant changes, we may provide additional notice.
            </p>

            <h2 className="text-2xl font-semibold mb-6">Third-Party Services</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Payment Processing</h3>
                <p className="text-sm text-gray-600">We use trusted payment processors who have their own privacy policies and security measures.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Analytics</h3>
                <p className="text-sm text-gray-600">We may use analytics services to understand website usage. These services have their own privacy policies.</p>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p><strong>Email:</strong> privacy@boomwarehouse.com</p>
                  <p><strong>Phone:</strong> (216) 555-0123</p>
                  <p><strong>Hours:</strong> Mon-Fri 9AM-6PM</p>
                </div>
                <div>
                  <p><strong>Mail:</strong></p>
                  <p>Boom Warehouse<br/>
                  Privacy Officer<br/>
                  Warrensville Heights, OH</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded">
                <p className="text-sm">
                  <strong>Response Time:</strong> We aim to respond to privacy-related inquiries within 5 business days. For urgent privacy concerns, please call us directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}