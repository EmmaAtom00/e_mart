"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            setError("Please fill in all fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSuccess(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send message");
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: Phone,
            title: "Phone",
            details: "+1 (234) 567-890",
            subtext: "Mon-Fri, 9AM-6PM EST",
        },
        {
            icon: Mail,
            title: "Email",
            details: "support@emart.com",
            subtext: "We'll respond within 24 hours",
        },
        {
            icon: MapPin,
            title: "Address",
            details: "123 Tech Street, Silicon Valley, CA 94025",
            subtext: "Visit our office",
        },
        {
            icon: Clock,
            title: "Business Hours",
            details: "9:00 AM - 6:00 PM EST",
            subtext: "Monday to Friday",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-black text-white py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8 lg:px-32 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-lg text-gray-300">
                        We'd love to hear from you. Get in touch with us today.
                    </p>
                </div>
            </div>

            {/* Contact Info Cards */}
            <div className="container mx-auto px-4 md:px-8 lg:px-32 py-16 md:py-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {contactInfo.map((info, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                            <info.icon size={40} className="mx-auto text-secondarytwo mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                            <p className="text-gray-900 font-semibold mb-1">{info.details}</p>
                            <p className="text-sm text-gray-600">{info.subtext}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Form & Map */}
            <div className="bg-gray-50 py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8 lg:px-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                            {/* Success Message */}
                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
                                    Message sent successfully! We'll get back to you soon.
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help?"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us more..."
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-secondarytwo text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        </div>

                        {/* Map Placeholder */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Find Us</h2>
                            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center text-6xl border border-gray-300">
                                🗺️
                            </div>
                            <p className="text-gray-600 mt-4 text-sm">
                                Visit our office in Silicon Valley. We're located in the heart of the tech
                                district, easily accessible by public transportation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="container mx-auto px-4 md:px-8 lg:px-32 py-16 md:py-24">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                    Frequently Asked Questions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {[
                        {
                            q: "What are your business hours?",
                            a: "We're open Monday to Friday, 9 AM to 6 PM EST. Support is available 24/7 via email.",
                        },
                        {
                            q: "How can I track my order?",
                            a: "You can track your order using the tracking number sent to your email after purchase.",
                        },
                        {
                            q: "What's your return policy?",
                            a: "We offer 30-day returns on most items. Check our return policy page for details.",
                        },
                        {
                            q: "Do you ship internationally?",
                            a: "Yes, we ship to over 50 countries. Shipping costs vary by location.",
                        },
                    ].map((faq, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                            <p className="text-gray-600 text-sm">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Contact;
