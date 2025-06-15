import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/store/use-store";
import { RegisterUser } from "@/lib/user_admin_utils";
import { useNavigate } from "react-router";
import { useEffect } from "react";
export default function AddAdminUser() {
  const addUsers = useStore((state) => state.addUsers);
  const token = useStore((state) => state.token);
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [middle_name, setMiddle_name] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const user = useStore((state) => state.user);

  useEffect(() => {
    if (user && user.userType !== "admin") {
      navigate("/dashboard", { replace: true });
    }
  }, [user]);

  const handleSubmit = () => {
    const data = {
      firstName: first_name,
      lastName: last_name,
      middleName: middle_name,
      email,
      address,
      phone,
      userType,
      note,
      password,
    };

    const base_url = import.meta.env.VITE_BASE_URL;
    RegisterUser({ url: `${base_url}api/admin/register/`, token, data })
      .then((res) => {
        // set user list
        addUsers(res.user);
        toast("user Registered", {
          description: res.message,
          action: {
            label: "X",
            onClick: () => console.log("toast closed."),
          },
        });

        navigate("/dashboard/admin");
      })
      .catch((error) => {
        console.log("error: ", error);
        toast("Error", {
          description: error.message ? error.messsage : "Something went wrong. ",
          action: {
            label: "X",
            onClick: () => console.log("toast closed."),
          },
        });
      });
  };

  return (
    <section className=" pb-2 flex flex-col md:flex-row items-center-safe justify-center gap-4 w-full max-w-2xl mx-auto mt-8">
      <div className="w-full px-3">
        <h2 className="text-2xl font-bold mb-2">Register a user</h2>

        <div className="grid grid-cols-2 gap-2 my-3">
          <div>
            <Label htmlFor="email" className="pb-1">
              Email
            </Label>
            <Input
              id="email"
              onChange={(e: any) => setEmail(e.target.value)}
              type="email"
              placeholder="info@abc.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone" className="pb-1">
              Phone
            </Label>
            <Input
              id="phone"
              onChange={(e: any) => setPhone(e.target.value)}
              type="text"
              placeholder="+1(800)222-2222"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 my-3 py-3">
          <div>
            <Label htmlFor="first_name" className="pb-1">
              First Name
            </Label>
            <Input
              id="first_name"
              onChange={(e: any) => setFirst_name(e.target.value)}
              type="text"
              placeholder="Mohammad"
              required
            />
          </div>
          <div>
            <Label htmlFor="middle_name" className="pb-1">
              Middle Name
            </Label>
            <Input
              id="middle_name"
              onChange={(e: any) => setMiddle_name(e.target.value)}
              type="text"
              placeholder="Ahmed"
            />
          </div>
          <div>
            <Label htmlFor="last_name" className="pb-1">
              Last Name
            </Label>
            <Input
              id="last_name"
              onChange={(e: any) => setLast_name(e.target.value)}
              type="text"
              placeholder="Ahmadi"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 my-3 py-3">
          <div>
            <Label htmlFor="address" className="pb-1">
              Address
            </Label>
            <Input
              id="address"
              onChange={(e: any) => setAddress(e.target.value)}
              type="text"
              placeholder="123 st, NY, USA.."
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 my-3 py-3">
          <div className="relative ">
            <Label htmlFor="password" className="pb-1">
              Password
            </Label>
            <Input
              id="password"
              onChange={(e: any) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              required
            />
            <div
              className="absolute right-0.5 top-5 bg-muted hover:bg-yellow-400 px-2 py-1 rounded-md "
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <Eye /> : <EyeOff />}
            </div>
          </div>

          <div className="">
            <Label> User Type</Label>
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>User Type</SelectLabel>
                  <SelectItem value={"personnel"}>{"Personnel"}</SelectItem>
                  <SelectItem value={"client"}>{"Client"}</SelectItem>
                  <SelectItem value={"admin"}>{"Admin"}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid w-full gap-3 mt-3">
          <Label htmlFor="report-details">Note</Label>
          <Textarea
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything to note to this user."
            className="h-48"
            value={note}
            id="report-details"
          />
        </div>

        <div className="flex justify-center  mt-4">
          <Button onClick={handleSubmit}>
            <Send className="" /> Save Report
          </Button>
        </div>
      </div>
    </section>
  );
}
