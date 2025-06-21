import { Button } from "@/components/ui/button";

import { DateTimePicker } from "@/components/report/report-filter";
import { X, Plus, Send, Activity } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useCallback, useMemo } from "react";
import { type siteType, siteStore } from "@/store/site-store";
import { useStore } from "@/store/use-store";
import { Link } from "react-router";
import AReport from "@/components/report/report-item";
import { listReport } from "@/lib/report_utils";
import { reportStore, type reportType } from "@/store/report-store";
import { listSites } from "@/lib/utils";

export default function Reports() {
  const [open, setOpen] = useState(false);
  const base_url = import.meta.env.VITE_BASE_URL;
  const sites = siteStore((state) => state.sites);
  const setSites = siteStore((state) => state.setSites);
  const [selectedSites, setSelectedSites] = useState<any>([]);
  const [inputValue, setInputValue] = useState("");
  const setReport = reportStore((state) => state.setReport);
  const reports = reportStore((state) => state.reports);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("");
  const user = useStore((state) => state.user);

  const handleUnselect = useCallback((site: siteType) => {
    setSelectedSites((prev: any) => prev.filter((s: any) => s.id !== site.id));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && selectedSites.length > 0) {
        setSelectedSites((prev: any) => prev.slice(0, -1));
      }
    },
    [selectedSites]
  );

  useEffect(() => {
    const params = {
      user: user.id,
    };

    listSites(`${base_url}api/site/`, params)
      .then((res) => {
        setSites(res.data.sites);
      })
      .catch((err) => {
        console.log("err while getting sites", err);
      });
  }, [user]);

  const filteredSites = useMemo(
    () => sites.filter((site) => !selectedSites.includes(site)),
    [selectedSites]
  );

  const getReports = () => {
    const params = {
      sites: selectedSites.map((site: any) => site.id),
      date: date,
      time: time,
      user_email: user.email,
    };

    listReport(`${base_url}api/report/`, params)
      .then((res) => {
        console.log("reports", res.reports);
        setReport(res.reports);
      })
      .catch((err) => console.log("err: ", err));
  };

  useEffect(() => {
    if (user && user.id && user.id.length >= 1) {
      getReports();
      console.log("listing the reports");
    }
  }, [user]);

  const hadleFilter = () => {
    getReports();
  };
  return (
    <section className="py-6">
      <div className="container px-0 md:px-8">
        {/* the filter, comes here. */}
        <div className="border-b-1 pb-2 flex flex-col md:flex-row items-center-safe justify-center gap-4 ">
          {user && user.userType === "personnel" && (
            <Button asChild variant={"outline"}>
              <Link to="add-report">
                <Plus />
              </Link>
            </Button>
          )}

          <div className=" sm:w-[70%] md:w-fit">
            <Command className="overflow-visible " id="selectSite">
              <div className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="flex flex-wrap gap-2">
                  {selectedSites.map((site: any) => {
                    return (
                      <Badge key={site.id} variant="secondary" className="border flex items-center">
                        {site.name}
                        <span
                          className="flex items-center justify-center size-4 text-muted-foreground hover:text-foreground ml-2 cursor-pointer"
                          onMouseDown={(e: any) => {
                            e.preventDefault();
                          }}
                          onClick={() => {
                            return handleUnselect(site);
                          }}>
                          <X />
                        </span>
                      </Badge>
                    );
                  })}
                  <CommandPrimitive.Input
                    onKeyDown={handleKeyDown}
                    onValueChange={setInputValue}
                    value={inputValue}
                    onBlur={() => setOpen(false)}
                    onFocus={() => setOpen(true)}
                    placeholder="Select Sites"
                    className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div className="relative ">
                <CommandList>
                  {open && !!filteredSites.length && (
                    <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
                      <CommandGroup className="h-full overflow-auto">
                        {filteredSites.map((site) => {
                          return (
                            <CommandItem
                              key={site.id}
                              onMouseDown={(e) => {
                                e.preventDefault();
                              }}
                              onSelect={() => {
                                setInputValue("");
                                setSelectedSites((prev: any) => [...prev, site]);
                              }}
                              className={"cursor-pointer"}>
                              {site.name}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </div>
                  )}
                </CommandList>
              </div>
            </Command>
          </div>

          <DateTimePicker date={date} setDate={setDate} time={time} setTime={setTime} />
          <Button className="cursor-pointer" onClick={hadleFilter}>
            <Send />
          </Button>
        </div>

        <div className="flex flex-col max-w-screen-sm  mx-auto mt-5">
          {reports.length < 1 && (
            <div className="flex flex-col pt-5 gap-4 items-center justify-center">
              <Activity size={60} />
              <p>No report to show</p>
            </div>
          )}
          {reports.map((item: reportType, index: number) => (
            <AReport item={item} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
