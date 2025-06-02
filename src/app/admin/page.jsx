import { ChartLineDefault } from "@/components/home/Chart1";
import { ChartAreaInteractive } from "@/components/home/Chart2";

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-3 gap-3">
        <ChartLineDefault />
        <ChartLineDefault />
        <ChartLineDefault />
      </div>
      <ChartAreaInteractive />
    </div>
  );
}
