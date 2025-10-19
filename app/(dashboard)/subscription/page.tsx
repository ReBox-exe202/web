"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Package, Users, Building2, Sparkles } from "lucide-react"

export default function SubscriptionPage() {
  const router = useRouter()
  const plans = [
    {
      name: "Starter",
      price: 99,
      period: "month",
      description: "Perfect for small restaurants and cafes getting started",
      icon: Package,
      features: [
        "Up to 500 items tracked",
        "2 pickup points",
        "Basic QR code generation",
        "Standard analytics dashboard",
        "Email support",
        "7-day return cycle tracking",
      ],
      limits: {
        items: "500 items",
        pickupPoints: "2 locations",
        users: "3 team members",
      },
    },
    {
      name: "Professional",
      price: 249,
      period: "month",
      description: "Ideal for growing businesses with multiple locations",
      icon: Building2,
      popular: true,
      features: [
        "Up to 2,500 items tracked",
        "10 pickup points",
        "Advanced QR batch generation",
        "Real-time analytics & reports",
        "Priority support",
        "Custom lifecycle tracking",
        "Partner management portal",
        "Loss prevention alerts",
      ],
      limits: {
        items: "2,500 items",
        pickupPoints: "10 locations",
        users: "10 team members",
      },
    },
    {
      name: "Enterprise",
      price: 599,
      period: "month",
      description: "For large-scale operations with advanced needs",
      icon: Sparkles,
      features: [
        "Unlimited items tracked",
        "Unlimited pickup points",
        "API access & integrations",
        "Custom analytics & BI tools",
        "24/7 dedicated support",
        "White-label QR codes",
        "Multi-brand management",
        "Advanced loss prevention",
        "Custom SLA configuration",
        "Dedicated account manager",
      ],
      limits: {
        items: "Unlimited",
        pickupPoints: "Unlimited",
        users: "Unlimited",
      },
    },
  ]

  const handleSelectPlan = (planName: string) => {
    router.push(`/checkout?plan=${planName}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <Badge variant="secondary" className="mb-2">
          Pricing Plans
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">Choose Your Plan</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Scale your reusable packaging management with flexible plans designed for businesses of all sizes
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto pt-8">
        {plans.map((plan) => {
          const Icon = plan.icon
          return (
            <Card
              key={plan.name}
              className={`group relative rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2 hover:scale-105 animate-in fade-in zoom-in cursor-pointer ${
                plan.popular 
                  ? "ring-2 ring-primary scale-105 shadow-xl hover:ring-4" 
                  : "hover:ring-2 hover:ring-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 shadow-lg">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="space-y-4 pb-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 group-hover:rotate-6 transform">
                    <Icon className="h-6 w-6 text-primary group-hover:scale-125 transition-transform duration-300" />
                  </div>
                  {plan.popular && (
                    <Badge variant="secondary" className="text-xs">
                      Save 20%
                    </Badge>
                  )}
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                    {plan.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold group-hover:scale-110 transition-transform duration-300 inline-block">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground mb-2">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-6">
                {/* Key Limits */}
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items:</span>
                    <span className="font-medium">{plan.limits.items}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Locations:</span>
                    <span className="font-medium">{plan.limits.pickupPoints}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Team:</span>
                    <span className="font-medium">{plan.limits.users}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <div className="p-6 pt-0 mt-auto">
                <Button
                  onClick={() => handleSelectPlan(plan.name)}
                  className="w-full group-hover:scale-105 transition-transform duration-300 group-hover:shadow-xl"
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  <span className="group-hover:mr-2 transition-all duration-300">Get Started</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid gap-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Can I upgrade or downgrade my plan?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades will apply
                at the end of your current billing cycle.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">What happens if I exceed my plan limits?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We&apos;ll notify you when you&apos;re approaching your limits. You can either upgrade your plan or purchase
                additional capacity as needed.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Is there a setup fee?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No setup fees. All plans include onboarding assistance and training materials to get you started
                quickly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="mt-12 text-center">
        <Card className="rounded-2xl shadow-sm bg-primary/5 border-primary/20 max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Need a Custom Plan?</h3>
            <p className="text-muted-foreground mb-6">
              Contact our sales team for custom enterprise solutions tailored to your specific needs.
            </p>
            <Button variant="default" size="lg">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
