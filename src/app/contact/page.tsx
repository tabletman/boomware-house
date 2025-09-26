import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container pl-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Have questions about our products or need help with an order?
              We're here to help! Reach out to our friendly team in Warrensville Heights.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container pl-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-6">Contact Information</h2>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-6 w-6 text-primary" />
                        <CardTitle>Visit Our Store</CardTitle>
                      </div>
                      <CardDescription>
                        Warrensville Heights, OH<br />
                        Free parking available
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Phone className="h-6 w-6 text-primary" />
                        <CardTitle>Call Us</CardTitle>
                      </div>
                      <CardDescription>
                        <a href="tel:+12165550123" className="hover:text-primary">
                          (216) 555-0123
                        </a><br />
                        Mon-Fri 9AM-7PM, Sat 10AM-6PM, Sun 12PM-5PM
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Mail className="h-6 w-6 text-primary" />
                        <CardTitle>Email Us</CardTitle>
                      </div>
                      <CardDescription>
                        <a href="mailto:info@boomwarehouse.com" className="hover:text-primary">
                          info@boomwarehouse.com
                        </a><br />
                        We'll get back to you within 24 hours
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Clock className="h-6 w-6 text-primary" />
                        <CardTitle>Business Hours</CardTitle>
                      </div>
                      <CardDescription>
                        <div className="space-y-1 mt-2">
                          <div>Monday - Friday: 9:00 AM - 7:00 PM</div>
                          <div>Saturday: 10:00 AM - 6:00 PM</div>
                          <div>Sunday: 12:00 PM - 5:00 PM</div>
                        </div>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                          First Name
                        </label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                          Last Name
                        </label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email Address
                      </label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">
                        Phone Number (Optional)
                      </label>
                      <Input id="phone" type="tel" placeholder="(216) 555-0123" />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">
                        Subject
                      </label>
                      <Input id="subject" placeholder="How can we help?" />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        rows={6}
                        placeholder="Tell us about your question or inquiry..."
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/50">
        <div className="container pl-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mt-4">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Do you offer pickup and delivery?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! We offer free pickup in the Warrensville Heights area and affordable local delivery.
                  Contact us to schedule pickup or delivery for your order.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's your return policy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer returns within the warranty period based on the condition grade of your item.
                  See our Returns & Exchanges page for full details.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Can I see items in person before buying?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely! We encourage customers to visit our store in Warrensville Heights to
                  inspect items in person. Check our hours above and come on by!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Do you buy used electronics?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, we purchase quality used electronics! Bring your items in for an evaluation,
                  or call us to discuss what you'd like to sell.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}