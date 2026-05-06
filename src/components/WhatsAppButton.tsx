const whatsappUrl =
  'https://wa.me/447473504040?text=Hello%20Smart%20Environment%20Group%2C%20I%27d%20like%20to%20discuss%20a%20project.';

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Smart Environment Group on WhatsApp"
      className="fixed bottom-24 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-slate-950/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1ebe5d] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-white sm:bottom-8 sm:right-6"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="h-8 w-8"
        fill="currentColor"
      >
        <path d="M16.02 3.2A12.75 12.75 0 0 0 5.1 22.5L3.6 28.8l6.45-1.5A12.73 12.73 0 1 0 16.02 3.2Zm0 22.95a10.1 10.1 0 0 1-5.15-1.4l-.37-.22-3.82.9.92-3.72-.24-.39a10.16 10.16 0 1 1 8.66 4.83Zm5.58-7.6c-.3-.15-1.8-.9-2.08-1-.28-.1-.48-.15-.68.15-.2.3-.78 1-.95 1.17-.18.2-.35.22-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.64-.93-2.25-.25-.59-.5-.5-.68-.51h-.58c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.13 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.08 1.8-.73 2.05-1.44.25-.7.25-1.3.18-1.44-.08-.13-.28-.2-.58-.35Z" />
      </svg>
    </a>
  );
}
