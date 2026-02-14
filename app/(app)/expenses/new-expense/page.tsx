import FieldExpense from "@/features/expenses/components/field-expense";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    
    // <div className="">
      <Card className="">
        <h1 className="flex text-2xl font-medium justify-center">
          New expense
        </h1>

        <FieldExpense/>
      </Card>
    // </div>
  );
}
