import { ChartAreaGradient } from "@/components/chart-area-gradient";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { ChartPieDonutText } from '@/features/home/components/chart-pie-donut-text'

export default function Page() {
  return (
    <div className="m-8">
      
      <div className="mt-24">
        <ChartAreaInteractive />
      </div>

      <div>
        <ChartAreaGradient />
      </div>

    </div>
  );
}
