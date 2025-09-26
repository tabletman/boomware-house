import { MainLayout } from '@/components/layout/main-layout'

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container pl-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Boom Warehouse</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              Your trusted source for quality used electronics, computers, and appliances in the Warrensville Heights area.
            </p>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                <p className="mb-4">
                  Founded with a mission to make quality technology accessible to everyone, Boom Warehouse has been serving the Cleveland area with carefully inspected, refurbished electronics and appliances. We believe that great technology shouldn't break the bank.
                </p>
                <p className="mb-4">
                  Every item in our inventory goes through a rigorous inspection and testing process to ensure you receive products that meet our high standards for quality and reliability.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Thorough quality inspection on all items
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    90-day warranty on most electronics
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Local Cleveland area pickup and delivery
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Expert tech support and customer service
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Competitive pricing on name-brand electronics
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
              <p className="mb-4">
                We're committed to reducing electronic waste while providing affordable technology solutions. By refurbishing and reselling quality used electronics, we help extend the life of products while making them accessible to more people.
              </p>
              <p>
                Our team of experienced technicians ensures every device meets our strict quality standards before it reaches your hands.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6">Visit Our Location</h2>
              <div className="bg-white border rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p className="text-gray-600 mb-4">
                      Warrensville Heights, OH<br/>
                      Cleveland Metro Area
                    </p>

                    <h3 className="font-semibold mb-2">Contact</h3>
                    <p className="text-gray-600 mb-2">Phone: (216) 555-0123</p>
                    <p className="text-gray-600">Email: info@boomwarehouse.com</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Business Hours</h3>
                    <div className="text-gray-600">
                      <p>Monday - Friday: 9AM - 7PM</p>
                      <p>Saturday: 10AM - 6PM</p>
                      <p>Sunday: 12PM - 5PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}