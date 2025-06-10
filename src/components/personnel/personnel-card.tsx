import type { personnelType } from "@/store/personnel-store";
import UpdatePersonnel from "./update_personnel";
import RemovePersonnel from "./remove_personnel";
import { Badge } from "../ui/badge";
import ImageProfile from "@/components/personnel/Image-profile";

export default function PersonnelCard({ member }: { member: personnelType }) {
  const base_url = import.meta.env.VITE_BASE_URL || "/";
  return (
    <div
      key={member.id}
      className="flex flex-col items-center text-center bg-accent py-3 px-6 rounded-lg">
      <div className="flex justify-center mb-3">
        <ImageProfile
          user={member}
          image_url={`${base_url.replace(/\/$/, "")}${member.photoUrl}`}
        />
      </div>
      <h3 className=" text-lg font-semibold">
        {member.firstName} {member.middleName} {member.lastName}
      </h3>
      <p className="text-muted-foreground text-sm">
        {member.sites?.map((site: any, index) => {
          return (
            <Badge key={index + site.id} className="mx-1">
              {site?.name}
            </Badge>
          );
        })}
      </p>

      <p>{member.email}</p>
      <p>{member.phone}</p>
      <div className="mt-auto flex items-center gap-4">
        <UpdatePersonnel personnel={member} />
        {member.id && <RemovePersonnel id={member.id} />}
      </div>
    </div>
  );
}
