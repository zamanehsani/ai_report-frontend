import { ChartAreaInteractive } from "./chart-area-interactive";

import { SectionCards } from "./section-cards";

export default function Analytic() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </>
  );
}
