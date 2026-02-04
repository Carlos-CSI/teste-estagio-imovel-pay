import Header from "./components/header";
import { Button } from "./components/ui/button";
import DebtList from "./components/debtList";
import { Plus } from "lucide-react";

export default function App() {
  return (
    <>
      <Header />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex justify-end">
            <Button>
              <Plus className="size-4.5" />
              Criar cobrança
            </Button>
          </div>

          <DebtList />
        </div>
      </main>
    </>
  );
}
