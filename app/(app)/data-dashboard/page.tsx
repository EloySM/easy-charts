import { ChartAreaGradient } from "@/features/data-dashboard/components/chart-area-gradient";
import { ChartAreaInteractive } from "@/features/data-dashboard/components/chart-area-interactive";
import { SectionCards } from "@/features/data-dashboard/components/section-card";

export default function Page() {
  return (
    <div className="m-8">

      <div>
        <SectionCards/>
      </div>

      <div className="">
        <ChartAreaInteractive />
      </div>

      <div>
        <ChartAreaGradient />
      </div>

    </div>
  );
}
