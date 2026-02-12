import { ChartAreaGradient } from "@/features/data-dashboard/components/chart-area-gradient";
import { ChartAreaInteractive } from "@/features/data-dashboard/components/chart-area-interactive";
import { SectionCards } from "@/features/data-dashboard/components/section-card";
import getExpensesComparison from "@/features/data-dashboard/services/get-expenses-comparison";

export default async function Page() {

  const expenseComparision = await getExpensesComparison(90)

  return (
    <div className="m-8">

      <div>
        <SectionCards/>
      </div>

      <div className="mt-8">
        <ChartAreaInteractive initialData={expenseComparision} />
      </div>

      {/* <div>
        <ChartAreaGradient />
      </div> */}

    </div>
  );
}
