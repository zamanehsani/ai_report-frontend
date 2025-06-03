import { LoginForm } from "@/components/login-form";
import logo from "../assets/logo.png";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col border-4 items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex flex-col items-center self-center font-medium">
          <div className="flex flex-col items-center w-full gap-2 mb-2">
            <img src={logo} alt="Protection Corps Logo" width={200} className="mx-auto" />
          </div>
          {/* <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span className="text-xl font-extrabold">Protection Corps Security Service</span>
          <span className="text-xs">The private patrol services you can trust</span> */}
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
