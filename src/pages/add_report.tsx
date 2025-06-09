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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import VoiceInput from "@/components/report/voice-input";
import { siteStore } from "@/store/site-store";
import { Send, X } from "lucide-react";
import { useState } from "react";
import { useRef } from "react";
import { useStore } from "@/store/use-store";
import { transcribeAudio } from "@/components/report/audio-to-text";
import { describeImage } from "@/components/report/image-to-text";
import { aiSummary, type inputProp } from "@/components/report/ai-summary";

export default function AddReports() {
  const sites = siteStore((state) => state.sites);
  const user = useStore((state) => state.user);
  const [dateNTime, setDateNTime] = useState(new Date());
  const [selectedSite, setSelectedSite] = useState("");
  const [reportBody, setReportBody] = useState("");

  const [audioDesc, setAudioDesc] = useState("");
  const [imageDesc, setImageDesc] = useState("");
  const [aiSum, setAISum] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // New state for image file and preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handlePhotoChange = (event: any) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = (e: any) => {
    e.preventDefault();
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = () => {
    if (audioBlob) {
      transcribeAudio(audioBlob)
        .then((response) => {
          setAudioDesc(response);
          console.log("audio transcripted and descripted: ", response);
          console.log("\n\n");
          if (imageFile) {
            describeImage(imageFile)
              .then((res) => {
                setImageDesc(res);
                console.log("image summarized: ", res);
                console.log("\n\n");
                if (user.email) {
                  console.log("generating the report by AI: ");
                  const data: inputProp = {
                    site: selectedSite,
                    dateNTime,
                    reportBody,
                    user: user.email,
                    audioDesc,
                    imageDesc: res,
                  };
                  aiSummary(data)
                    .then((res) => {
                      console.log("res: ", res);
                    })
                    .catch((error) => {
                      console.log("error: ", error);
                    });
                }
              })
              .catch((error) => {
                console.log("error while doing the checking for image: ", error);
              });
          }
        })
        .catch((error) => {
          console.log("error happened while doing the audio:", error);
          console.log("\n\n");
        });
    }
  };
  return (
    <section className="border-b-1 pb-2 flex flex-col md:flex-row items-center-safe justify-center gap-4 w-full max-w-2xl mx-auto mt-8">
      <div className="w-full px-3">
        <h2 className="text-2xl font-bold mb-2">Create a Report</h2>
        <div className="text-sm text-muted-foreground mb-4">{new Date().toLocaleString()}</div>

        <div className="py-2">
          <Select value={selectedSite} onValueChange={setSelectedSite}>
            <SelectTrigger className="w-[30%]">
              <SelectValue placeholder="Select Site" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sites</SelectLabel>
                {sites.map((site) => {
                  return (
                    <SelectItem key={site.id} value={site.name}>
                      {site.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full gap-3 mt-3">
          <Label htmlFor="report-details">Report Details</Label>
          <Textarea
            onChange={(e) => setReportBody(e.target.value)}
            placeholder="Type your observation here..."
            className="h-48"
            value={reportBody}
            id="report-details"
          />
          <p className="text-muted-foreground text-sm">Please provide as details as possible.</p>
        </div>
        <div>
          {/* Show image preview if available */}
          {imagePreview && (
            <div className="relative inline-block">
              <img src={imagePreview} alt="Preview" className="rounded-lg border" />
              <Button
                variant="destructive"
                className="absolute top-0 right-0 shadow-xl rounded-full size-8"
                onClick={removeImage}
                type="button">
                <X />
              </Button>
            </div>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Photo</label>
          <input
            className="border rounded-lg px-4 py-1 bg-background"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            // Hide the file input's selected file name by resetting the value after selection
            ref={fileInputRef}
            value=""
            placeholder=""
          />
        </div>
        <div className="py-4">
          <VoiceInput onRecordingComplete={setAudioBlob} />
        </div>
        <div className="flex justify-center">
          <Button onClick={handleSubmit}>
            <Send className="" /> Save Report
          </Button>
        </div>
      </div>
    </section>
  );
}
