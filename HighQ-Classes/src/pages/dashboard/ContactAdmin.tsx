import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useContact } from "@/hooks/useContact";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ContactAdmin: React.FC = () => {
    const { user } = useAuth();
    const { sendStudentTeacherMessage, loading, error, clearError } =
        useContact();

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setSuccessMsg("");

        if (!subject.trim() || !message.trim()) {
            return;
        }

        try {
            const response = await sendStudentTeacherMessage({
                subject,
                message,
            });

            if (response.success) {
                setSubject("");
                setMessage("");
                setSuccessMsg(
                    "Your message has been sent successfully! We'll get back to you soon."
                );
            }
        } catch (err) {
            // Error is handled by the hook
            console.error("Contact form error:", err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Contact Admin
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Have a question, suggestion, or need assistance? Get in
                    touch with our admin team. We're here to help and will
                    respond as soon as possible.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Send className="h-5 w-5" />
                            Send Message
                        </CardTitle>
                        <CardDescription>
                            Fill out the form below and we'll get back to you
                            within 24-48 hours.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* User Info (Read-only) */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={user?.name || ""}
                                        readOnly
                                        className="bg-gray-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={user?.email || ""}
                                        readOnly
                                        className="bg-gray-50"
                                    />
                                </div>
                            </div>

                            {/* Role Badge */}
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span
                                    className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                                        user?.role === "teacher"
                                            ? "bg-green-100 text-green-700"
                                            : user?.role === "admin"
                                            ? "bg-purple-100 text-purple-700"
                                            : "bg-blue-100 text-blue-700"
                                    }`}
                                >
                                    {String(user?.role || "USER").toUpperCase()}
                                </span>
                            </div>

                            {/* Subject */}
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject *</Label>
                                <Input
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Brief description of your inquiry"
                                    required
                                />
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <Label htmlFor="message">Message *</Label>
                                <Textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={6}
                                    placeholder="Describe your question, concern, or feedback in detail..."
                                    required
                                />
                            </div>

                            {/* Error Alert */}
                            {error && (
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertDescription className="text-red-700">
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Sending Message...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Contact Information & Success Message */}
                <div className="space-y-6">
                    {/* Success Message */}
                    <AnimatePresence>
                        {successMsg && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Alert className="border-green-200 bg-green-50">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-700">
                                        {successMsg}
                                    </AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Get in Touch</CardTitle>
                            <CardDescription>
                                Alternative ways to reach us
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p className="text-gray-600">
                                        admin@highqclasses.com
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        We respond within 24-48 hours
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Phone</p>
                                    <p className="text-gray-600">
                                        +1 (555) 123-4567
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Mon-Fri, 9:00 AM - 6:00 PM
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Address</p>
                                    <p className="text-gray-600">
                                        123 Education Street
                                        <br />
                                        Learning City, LC 12345
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* FAQ */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Frequently Asked Questions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="font-medium text-sm">
                                    How quickly will I receive a response?
                                </p>
                                <p className="text-sm text-gray-600">
                                    We typically respond within 24-48 hours
                                    during business days.
                                </p>
                            </div>
                            <div>
                                <p className="font-medium text-sm">
                                    What information should I include?
                                </p>
                                <p className="text-sm text-gray-600">
                                    Please provide as much detail as possible
                                    about your question or issue.
                                </p>
                            </div>
                            <div>
                                <p className="font-medium text-sm">
                                    Is there a phone number for urgent matters?
                                </p>
                                <p className="text-sm text-gray-600">
                                    Yes, you can call us at +1 (555) 123-4567
                                    during business hours.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ContactAdmin;
