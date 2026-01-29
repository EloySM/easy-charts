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
      <div 
        className="grid md:grid-cols-2 gap-10 my-8 grid-cols-1"
      >
        {/* <ChartPieDonutText />
        <ChartPieDonutText /> */}
      </div>
      <ChartAreaGradient />
    </div>

    </div>
  );
}
