"use client";

import { useMutation } from "convex/react";
import { motion, type Variants } from "framer-motion";
import { CheckCircle2, Loader2, Mail, Send, User } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../../../convex/_generated/api";

interface ContactFormProps {
  itemVariants: Variants;
}

type FormState = "idle" | "submitting" | "success" | "error";

export const ContactForm: React.FC<ContactFormProps> = ({ itemVariants }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");

  const submitContact = useMutation(api.contacts.submitContact);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) return;

    if (!name.trim() || !email.trim() || !message.trim()) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }

    setFormState("submitting");

    try {
      await submitContact({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || undefined,
        message: message.trim(),
      });
      setFormState("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setFormState("error");
    }
  };

  if (formState === "success") {
    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="md:col-span-12 bg-[#93E190] p-6 md:p-10 lg:p-14 rounded-2xl md:rounded-[3rem] shadow-lg md:shadow-xl"
      >
        <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg">
            <CheckCircle2 size={32} className="text-[#5A3927] md:size-10" />
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-black text-[#5A3927] mb-3 md:mb-4">
            Message Sent!
          </h3>
          <p className="text-[#5A3927]/80 max-w-md text-base md:text-lg px-4">
            Thanks for reaching out! I'll get back to you as soon as possible.
          </p>
          <button
            type="button"
            onClick={() => setFormState("idle")}
            className="mt-6 md:mt-8 px-6 md:px-8 py-2.5 md:py-3 bg-white rounded-full font-bold text-[#5A3927] text-sm md:text-base shadow-md hover:shadow-lg transition-shadow"
          >
            Send Another Message
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={itemVariants}
      whileInView="visible"
      viewport={{ once: true }}
      className="md:col-span-12 bg-white/60 backdrop-blur-md p-6 md:p-10 lg:p-14 rounded-2xl md:rounded-[3rem] shadow-sm border border-white/60"
    >
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FA9939] rounded-xl md:rounded-2xl flex items-center justify-center">
          <Mail size={20} className="text-white md:size-6" />
        </div>
        <div>
          <h3 className="font-serif text-xl md:text-2xl lg:text-3xl font-black text-[#5A3927]">
            Get In Touch
          </h3>
          <p className="text-xs md:text-sm text-[#693B2A]/60">
            Have a project in mind? Let's talk!
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-xs md:text-sm font-bold text-[#5A3927]/60 uppercase tracking-wider mb-1.5 md:mb-2"
            >
              Name *
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[#5A3927]/40 md:size-[18px]"
              />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-white rounded-xl md:rounded-2xl border border-[#5A3927]/10 focus:border-[#FA9939] focus:ring-2 focus:ring-[#FA9939]/20 outline-none transition-all text-sm md:text-base text-[#5A3927] placeholder:text-[#5A3927]/30"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs md:text-sm font-bold text-[#5A3927]/60 uppercase tracking-wider mb-1.5 md:mb-2"
            >
              Email *
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[#5A3927]/40 md:size-[18px]"
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-white rounded-xl md:rounded-2xl border border-[#5A3927]/10 focus:border-[#FA9939] focus:ring-2 focus:ring-[#FA9939]/20 outline-none transition-all text-sm md:text-base text-[#5A3927] placeholder:text-[#5A3927]/30"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-xs md:text-sm font-bold text-[#5A3927]/60 uppercase tracking-wider mb-1.5 md:mb-2"
          >
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What's this about?"
            className="w-full px-3 md:px-4 py-3 md:py-4 bg-white rounded-xl md:rounded-2xl border border-[#5A3927]/10 focus:border-[#FA9939] focus:ring-2 focus:ring-[#FA9939]/20 outline-none transition-all text-sm md:text-base text-[#5A3927] placeholder:text-[#5A3927]/30"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-xs md:text-sm font-bold text-[#5A3927]/60 uppercase tracking-wider mb-1.5 md:mb-2"
          >
            Message *
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            placeholder="Tell me about your project..."
            className="w-full px-3 md:px-4 py-3 md:py-4 bg-white rounded-xl md:rounded-2xl border border-[#5A3927]/10 focus:border-[#FA9939] focus:ring-2 focus:ring-[#FA9939]/20 outline-none transition-all text-sm md:text-base text-[#5A3927] placeholder:text-[#5A3927]/30 resize-none"
          />
        </div>

        {/* Honeypot field for spam protection */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {formState === "error" && (
          <div className="p-3 md:p-4 bg-red-50 border border-red-200 rounded-xl md:rounded-2xl text-red-700 text-xs md:text-sm">
            Something went wrong. Please try again later.
          </div>
        )}

        <button
          type="submit"
          disabled={formState === "submitting"}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-10 py-3 md:py-4 bg-[#FA9939] rounded-full font-bold text-white text-sm md:text-base shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {formState === "submitting" ? (
            <>
              <Loader2 size={18} className="animate-spin md:size-5" />
              Sending...
            </>
          ) : (
            <>
              <Send size={18} className="md:size-5" />
              Send Message
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};
