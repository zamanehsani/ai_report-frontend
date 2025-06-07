import type { personnelType } from "@/store/personnel-store";
import UpdatePersonnel from "./update_personnel";
import RemovePersonnel from "./remove_personnel";
export default function PersonnelCard({ member }: { member: personnelType }) {
  return (
    <div
      key={member.id}
      className="flex flex-col items-center text-center bg-accent py-3 px-6 rounded-lg">
      <h3 className=" text-lg font-semibold">
        {member.firstName} {member.middleName} {member.lastName}
      </h3>
      <p className="text-muted-foreground text-sm">
        {member.email} | {member.phone}
      </p>

      <div className="mt-auto flex items-center gap-4">
        <UpdatePersonnel personnel={member} />
        {member.id && <RemovePersonnel id={member.id} />}
      </div>
    </div>
  );
}
