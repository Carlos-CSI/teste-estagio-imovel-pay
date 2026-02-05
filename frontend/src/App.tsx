import Header from "./components/header";
import DebtList from "./components/debtList";
import CreateDebtButton from "./components/createDebt";

export default function App() {
  return (
    <>
      <Header />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex justify-end">
            <CreateDebtButton />
          </div>

          <DebtList />
        </div>
      </main>
    </>
  );
}
