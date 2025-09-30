import CurrencySelector from "@/components/currency-selector";

interface HeaderProps {
  title: string;
  description: string;
}

export default function Header({ title, description }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <p className="text-slate-600 mt-1">{description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <CurrencySelector />
        </div>
      </div>
    </header>
  );
}