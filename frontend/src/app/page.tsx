import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Brain, ClipboardList } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white text-black">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 bg-transparent absolute top-0 z-100">
        <div className="text-lg font-semibold text-white bg-black/60 px-3 py-1 rounded shadow">
          <Link href="/">
            TripMate AI
          </Link>
        </div>
        <div>
          <Link href="/sign-in">
            <Button className="text-md cursor-pointer bg-white text-black font-medium shadow-md hover:bg-blue-500 hover:text-white">
              Sign in
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="w-full h-[90vh] bg-cover bg-center flex flex-col justify-center items-center text-center px-4 relative"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1650&q=80")',
        }}
      >
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/20"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-xl">
            Your AI Travel Companion
          </h1>
          <p className="mt-4 text-lg md:text-xl font-semibold max-w-2xl">
            Experience personalized travel planning powered by artificial intelligence. Create your perfect journey in minutes.
          </p>
          <Button className="mt-6 text-lg px-6 p-6 cursor-pointer shadow-md hover:bg-blue-500 hover:text-white">Start Planning</Button>
        </div>
      </section>

      {/* Why Choose TripMate AI Section */}
      <section className="py-16 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-bold mb-12">Why Choose TripMate AI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <Card className="shadow-xl">
            <CardContent className="p-6 flex flex-col items-center">
              <Brain className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Planning</h3>
              <p className="text-sm text-gray-600">
                Our AI agent analyzes millions of travel data points to create the perfect itinerary for you.
              </p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="shadow-xl">
            <CardContent className="p-6 flex flex-col items-center">
              <ClipboardList className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Personalized Experience</h3>
              <p className="text-sm text-gray-600">
                Get recommendations tailored to your interests, travel style, and budget constraints.
              </p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="shadow-xl">
            <CardContent className="p-6 flex flex-col items-center">
              <CheckCircle className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-sm text-gray-600">
                Stay informed with live updates about your destination, weather, and travel conditions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
