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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

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
import { generateReportPDF } from "@/components/report/make-pdf";
import { CreateReport } from "@/lib/report_utils";
import { useEffect } from "react";
import { listPersonnel } from "@/lib/personnel_utils";

export default function AddReports() {
  const sites = siteStore((state) => state.sites);
  const user = useStore((state) => state.user);
  const [personnel, setPersonnel] = useState({ id: "" });
  const [dateNTime, setDateNTime] = useState(new Date());
  const [selectedSite, setSelectedSite] = useState("");
  const [reportBody, setReportBody] = useState("");
  const [progress, setProgress] = useState(10);
  const [audioDesc, setAudioDesc] = useState("");
  const [imageDesc, setImageDesc] = useState("");
  const [aiSum, setAISum] = useState("");
  const [dialog, setDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // New state for image file and preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const token = useStore((state) => state.token);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const base_url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    listPersonnel(`${base_url}api/personnel/?email=${user.email}`)
      .then((res) => {
        setPersonnel(res.data.personnels[0]);
        console.log("res of persno: ", res.data.personnels[0]);
      })
      .catch((err) => {
        console.log("err getting personne;:", err);
      });
  }, []);

  const handlePhotoChange = (event: any) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const sendBack = () => {
    const formData = new FormData();
    formData.append("generatedSummary", aiSum);
    if (user.id) formData.append("userId", user.id);
    formData.append("siteId", selectedSite);
    if (reportFile) formData.append("pdf", reportFile);
    if (imageFile) formData.append("image", imageFile);
    if (audioBlob) formData.append("voice", audioBlob);

    CreateReport({ data: formData, url: `${base_url}api/report/add`, token })
      .then((res) => {
        setProgress(100);
        setDialog(false);
        console.info(res);
      })
      .catch((error) => {
        console.log("error!");
        setDialog(false);
        console.error(error);
      });
  };

  // this useEffect is to make sure the PDF is saved and is ready to be sent to backend.
  useEffect(() => {
    if (reportFile) {
      sendBack();
    }
  }, [reportFile]);

  const removeImage = (e: any) => {
    e.preventDefault();
    setImageFile(null);
    setImagePreview(null);
  };

  const genPDF = async () => {
    console.info("starting the PDF, user, aiSum ");
    if (selectedSite && user && aiSum) {
      generateReportPDF({
        imageFile,
        user,
        site: selectedSite,
        text: aiSum,
      })
        .then((res) => {
          if (res) {
            console.log("pdf done!!...");
            setReportFile(res);
            setProgress(98);
            // // To download the PDF file
            // const url = URL.createObjectURL(res);
            // const link = document.createElement("a");
            // link.href = url;
            // link.download = "report.pdf";
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
            // URL.revokeObjectURL(url);
          }
        })
        .catch((err) => {
          console.log("eror: ", err);
          setDialog(false);
        });
    } else {
      console.info("here. the site or user or aiSum is not done", selectedSite, user, aiSum);
    }
  };

  // this useEffect is to make sure that aiSum is set and ready to be made a file out of it.
  useEffect(() => {
    console.log("aiSum is set. running the gePDF()");
    genPDF();
  }, [aiSum]);

  const handleSubmit = () => {
    if (audioBlob) {
      // show the progress dialog
      setDialog(true);
      if (user.email && imageFile) {
        console.log("starting transcription and image description in parallel");

        Promise.all([transcribeAudio(audioBlob), describeImage(imageFile)])
          .then(([audioResult, imageResult]) => {
            setAudioDesc(audioResult);
            setImageDesc(imageResult);
            setProgress(50);
            console.log("both audio and image processed");

            const data: inputProp = {
              site: selectedSite,
              dateNTime,
              reportBody,
              user: user.email!,
              audioDesc: audioResult,
              imageDesc: imageResult,
            };

            return aiSummary(data);
          })
          .then((aiResult) => {
            setProgress(70);
            console.log("result from AI summary ", aiResult);
            setAISum(aiResult);
          })
          .catch((error) => {
            console.log("Error in processing:", error);
          });
      }
    }
  };
  return (
    <section className=" pb-2 flex flex-col md:flex-row items-center-safe justify-center gap-4 w-full max-w-2xl mx-auto mt-8">
      <div className="w-full px-3">
        <h2 className="text-2xl font-bold mb-2">Create a Report</h2>
        <div className="text-sm text-muted-foreground mb-4">{new Date().toLocaleString()}</div>

        <div className="py-2">
          <Select value={selectedSite} onValueChange={setSelectedSite}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select Site" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sites</SelectLabel>
                {sites.map((site) => {
                  return (
                    <SelectItem key={site.id} value={site.id}>
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
      <AlertDialog open={dialog} onOpenChange={(dialog) => setDialog(dialog)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generating the report</AlertDialogTitle>
            {/* <AlertDialogDescription> */}
            <Progress value={progress} className="w-full" />
            {/* </AlertDialogDescription> */}
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
