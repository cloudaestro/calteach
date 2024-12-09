import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const tiers = [
  {
    name: "Basic",
    price: "$19",
    priceId: "price_1QTrrzB91imUhK3FMmednRAv", // Replace with your Stripe price ID
    features: [
      "Create up to 10 worksheets",
      "Basic crossword templates",
      "Export to PDF",
      "Email support"
    ]
  },
  {
    name: "Pro",
    price: "$49",
    priceId: "price_1QTrsdB91imUhK3FIZymm7bN", // Replace with your Stripe price ID
    features: [
      "Create unlimited worksheets",
      "Advanced crossword templates",
      "Priority email support",
      "Custom branding",
      "Advanced export options"
    ]
  },
  {
    name: "Enterprise",
    price: "$99",
    priceId: "price_1QTrt5B91imUhK3FaW5Frou1", // Replace with your Stripe price ID
    features: [
      "Everything in Pro",
      "School-wide license",
      "Phone support",
      "Custom integrations",
      "Training sessions",
      "Dedicated account manager"
    ]
  }
];

const Pricing = () => {
  const { user } = useAuth();

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      toast.error("Please login to subscribe");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId,
          customerId: user.id
        }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to start checkout process");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that best fits your needs
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="px-6 py-8">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {tier.name}
                </h3>
                <p className="mt-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-gray-500">/month</span>
                </p>
                <Button
                  className="mt-6 w-full"
                  onClick={() => handleSubscribe(tier.priceId)}
                >
                  Get Started
                </Button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;