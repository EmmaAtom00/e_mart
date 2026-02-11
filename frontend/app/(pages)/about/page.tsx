import { Award, Users, Zap, Globe } from "lucide-react";

const About = () => {
    const stats = [
        { icon: Users, label: "Happy Customers", value: "10M+" },
        { icon: Globe, label: "Countries", value: "50+" },
        { icon: Award, label: "Awards Won", value: "25+" },
        { icon: Zap, label: "Products", value: "100K+" },
    ];

    const team = [
        { name: "Sarah Johnson", role: "CEO & Founder", image: "👩‍💼" },
        { name: "Mike Chen", role: "CTO", image: "👨‍💼" },
        { name: "Emma Davis", role: "Head of Design", image: "👩‍💼" },
        { name: "Alex Rodriguez", role: "Head of Operations", image: "👨‍💼" },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-black text-white py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8 lg:px-32 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About E-Mart</h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Your trusted online marketplace for quality products at unbeatable prices
                    </p>
                </div>
            </div>

            {/* Story Section */}
            <div className="container mx-auto px-4 md:px-8 lg:px-32 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                        <p className="text-gray-600 mb-4">
                            Founded in 2020, E-Mart started with a simple mission: to make quality products
                            accessible to everyone, everywhere. What began as a small startup has grown into
                            a thriving marketplace serving millions of customers worldwide.
                        </p>
                        <p className="text-gray-600 mb-4">
                            We believe in transparency, quality, and customer satisfaction. Every product on
                            our platform is carefully curated to ensure it meets our high standards.
                        </p>
                        <p className="text-gray-600">
                            Today, we're proud to be one of the fastest-growing e-commerce platforms,
                            connecting buyers and sellers in a seamless, secure, and enjoyable shopping experience.
                        </p>
                    </div>
                    <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center text-6xl">
                        🏢
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-50 py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8 lg:px-32">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                        By The Numbers
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white rounded-lg p-6 text-center border border-gray-200">
                                <stat.icon size={40} className="mx-auto text-secondarytwo mb-4" />
                                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                                <p className="text-gray-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="container mx-auto px-4 md:px-8 lg:px-32 py-16 md:py-24">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                    Our Values
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Quality First",
                            description: "We prioritize quality in every product and service we offer.",
                        },
                        {
                            title: "Customer Centric",
                            description: "Your satisfaction is our top priority. We listen and improve.",
                        },
                        {
                            title: "Innovation",
                            description: "We constantly innovate to provide the best shopping experience.",
                        },
                        {
                            title: "Integrity",
                            description: "We operate with transparency and honesty in all our dealings.",
                        },
                        {
                            title: "Sustainability",
                            description: "We're committed to environmentally responsible practices.",
                        },
                        {
                            title: "Community",
                            description: "We support local businesses and give back to communities.",
                        },
                    ].map((value, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                            <p className="text-gray-600">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-gray-50 py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8 lg:px-32">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                        Meet Our Team
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {team.map((member, i) => (
                            <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200">
                                <div className="bg-gray-100 h-48 flex items-center justify-center text-6xl">
                                    {member.image}
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="font-bold text-gray-900">{member.name}</h3>
                                    <p className="text-sm text-gray-600">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-black text-white py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8 lg:px-32 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Shop?</h2>
                    <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                        Explore our wide range of products and find exactly what you're looking for.
                    </p>
                    <button className="px-8 py-3 bg-secondarytwo text-white rounded-lg font-semibold hover:opacity-90 transition">
                        Start Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default About;
