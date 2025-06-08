import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import { ChartLineDefault } from "@/components/home/Chart1";
import { ChartAreaInteractive } from "@/components/home/Chart2";

export default function Home() {
  return (
    <InnerDashboardLayout>
      <div className="w-full flex flex-col gap-4 mb-4">
        <h1 className="text-primary font-medium sm:text-lg lg:text-2xl">
          Hello, Mobiking!
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <ChartLineDefault />
        <ChartLineDefault />
        <ChartLineDefault />
      </div>
      <div className="mt-3">
        <ChartAreaInteractive />
      </div>
    </InnerDashboardLayout>
  );
}
