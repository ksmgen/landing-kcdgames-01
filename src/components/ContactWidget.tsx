"use client";

import { useState } from "react";
import { Phone, X } from "lucide-react";

/**
 * WhatsApp branded icon SVG
 */
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        aria-hidden="true"
    >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.03L7.54 18.85L4.43 19.67L5.26 16.64L5.06 16.33C4.24 15.02 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.03 8.47 7.03 9.63C7.03 10.8 7.88 11.92 8 12.08C8.12 12.23 9.6 14.52 11.87 15.5C13.72 16.3 14.1 16.14 14.5 16.1C14.9 16.06 15.8 15.56 16 15.01C16.19 14.45 16.19 13.97 16.13 13.87C16.07 13.77 15.92 13.71 15.68 13.59C15.44 13.47 14.26 12.89 14.04 12.78C13.82 12.67 13.66 12.61 13.5 12.86C13.34 13.11 12.88 13.65 12.74 13.81C12.59 13.97 12.44 13.99 12.2 13.87C11.96 13.75 11.19 13.5 10.28 12.69C9.57 12.06 9.1 11.28 8.94 11.02C8.79 10.77 8.93 10.63 9.05 10.51C9.16 10.4 9.3 10.23 9.42 10.09C9.54 9.95 9.59 9.85 9.67 9.69C9.75 9.53 9.71 9.39 9.65 9.27C9.59 9.15 9.15 8.06 8.97 7.62C8.8 7.18 8.62 7.24 8.53 7.33Z" />
    </svg>
);

export default function ContactWidget() {
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [captchaInput, setCaptchaInput] = useState("");
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [error, setError] = useState(false);

    const openCaptcha = () => {
        // Generate simple math problem
        setNum1(Math.floor(Math.random() * 9) + 1);
        setNum2(Math.floor(Math.random() * 9) + 1);
        setCaptchaInput("");
        setError(false);
        setShowCaptcha(true);
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (parseInt(captchaInput) === num1 + num2) {
            setShowCaptcha(false);
            window.open("https://wa.me/601116755187", "_blank");
        } else {
            setError(true);
            // Reset numbers on failure to prevent brute force? Or just keep them.
            // Keeping them is friendlier for simple math errors.
        }
    };

    return (
        <>
            {/* Contact Card */}
            <div className="flex items-center gap-4 rounded-xl bg-navy-900/50 p-6 ring-1 ring-navy-700">
                <Phone className="h-6 w-6 shrink-0 text-silver-400" />

                {/* Phone Number (Static Text) */}
                <div className="flex-1 text-navy-200">
                    +60 11-1675 5187
                </div>

                {/* WhatsApp Button */}
                <button
                    onClick={openCaptcha}
                    className="group relative flex items-center justify-center rounded-full bg-[#25D366] p-2 transition-all hover:scale-110 hover:bg-[#20bd5a] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-navy-950"
                    aria-label="Contact via WhatsApp"
                >
                    <WhatsAppIcon className="h-6 w-6 text-white" />
                </button>
            </div>

            {/* Captcha Modal */}
            {showCaptcha && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-navy-900 p-6 shadow-2xl ring-1 ring-white/10 animate-in fade-in zoom-in duration-200">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowCaptcha(false)}
                            className="absolute right-4 top-4 text-navy-400 hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="text-center space-y-4">
                            <h3 className="font-display text-xl font-bold text-white">Security Check</h3>
                            <p className="text-navy-200 text-sm">Please solve this simple math problem to continue to WhatsApp.</p>

                            <form onSubmit={handleVerify} className="space-y-4 pt-2">
                                <div className="flex items-center justify-center gap-3 text-2xl font-bold text-silver-100 bg-navy-950/50 p-4 rounded-lg border border-navy-800">
                                    <span>{num1}</span>
                                    <span>+</span>
                                    <span>{num2}</span>
                                    <span>=</span>
                                    <input
                                        type="number"
                                        value={captchaInput}
                                        onChange={(e) => setCaptchaInput(e.target.value)}
                                        className="w-16 rounded bg-navy-800 px-2 py-1 text-center text-white focus:outline-none focus:ring-2 focus:ring-silver-500"
                                        autoFocus
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-400 text-sm font-medium animate-pulse">Incorrect answer, please try again.</p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-silver-100 py-3 font-bold text-navy-950 transition-transform active:scale-95 hover:bg-white"
                                >
                                    Verify & Open WhatsApp
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
