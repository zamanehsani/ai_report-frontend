import { ChartAreaInteractive } from "./chart-area-interactive";
import { SectionCards } from "./section-cards";
import { useStore } from "@/store/use-store";
import { type userType } from "../store/use-store";

export default function Analytic() {
  const user = useStore<userType>((state) => state.user);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const authenticate = useStore((state) => state.authenticate);
  const setUser = useStore((state) => state.setUser);

  return (
    <>
      <SectionCards />
      <div className="py-8">
        <h1>User: {user.firstName}.</h1>
        <p>is authenticated: {isAuthenticated ? "Yes" : "No"}</p>
      </div>
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </>
  );
}
