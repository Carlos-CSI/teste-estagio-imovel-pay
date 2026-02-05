import { useState } from "react";
import { debtAPI } from "./services/api";
import type { DebtCreate } from "./types";
import Header from "./components/header";
import DebtList from "./components/debtList";
import CreateDebtButton from "./components/createDebt";
import Footer from "./components/footer";

export default function App() {
  const [refreshList, setRefreshList] = useState<number>(0);

  // Chama o callback quando nova cobrança for criada
  const handleCreatedDebt = async (data: DebtCreate): Promise<void> => {
    try {
      await debtAPI.toCreate(data);

      setRefreshList((prev) => prev + 1);

      alert("Cobrança criada com sucesso!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar cobrança";
      throw new Error(errorMessage);
    }
  };

  return (
    <>
      <Header />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex justify-end">
            <CreateDebtButton onCreatedDebt={handleCreatedDebt} />
          </div>

          <DebtList refreshList={refreshList} />
        </div>
      </main>

      <Footer />
    </>
  );
}
