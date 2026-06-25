import "../globals.css";
import GradientHeader from "./components/GradientHeader";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GradientHeader />
      <main className="flex-1 flex justify-center px-4 py-10">
        <div className="w-full max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
