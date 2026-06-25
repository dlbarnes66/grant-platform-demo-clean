export default function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
      {children}
    </div>
  );
}
