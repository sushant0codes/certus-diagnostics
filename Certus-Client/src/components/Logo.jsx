export default function Logo() {
  return (
    <div className="logo-container flex items-center gap-1 md:gap-4">
      <img src="/logo10.png" alt="Certus Diagnostics" className="h-16 w-auto" />
      <img
        src="/thyrocare.png"
        alt="Thyrocare"
        className="h-8 sm:h-10 w-auto rounded-md"
      />
      <img
        src="/agilus.png"
        alt="Agilus"
        className="h-8 sm:h-9 w-auto rounded-md"
      />
    </div>
  );
}
