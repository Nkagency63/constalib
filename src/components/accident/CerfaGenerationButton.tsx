
import React from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useCerfaGeneration } from "@/hooks/accident/useCerfaGeneration";
import { FormData } from "./types";
import DownloadButton from "./pdf/DownloadButton";
import RegisterButton from "./pdf/RegisterButton";
import OfficialReportDialog from "./pdf/OfficialReportDialog";

interface CerfaGenerationButtonProps {
  formData: FormData;
  className?: string;
  signatures?: {
    partyA: string | null;
    partyB: string | null;
  };
}

const CerfaGenerationButton = ({ formData, className = "", signatures }: CerfaGenerationButtonProps) => {
  const {
    isGenerating,
    isRegistering,
    showOfficialDialog,
    setShowOfficialDialog,
    referenceId,
    handleGenerateCerfa,
    handleRegisterOfficial,
    canRegisterOfficial
  } = useCerfaGeneration({ formData, signatures });

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <DownloadButton 
        onClick={handleGenerateCerfa}
        isGenerating={isGenerating}
        className={className}
      />

      <Dialog open={showOfficialDialog} onOpenChange={setShowOfficialDialog}>
        <DialogTrigger asChild>
          <RegisterButton 
            onClick={canRegisterOfficial ? handleRegisterOfficial : undefined}
            isRegistering={isRegistering}
            disabled={isGenerating || !canRegisterOfficial}
          />
        </DialogTrigger>

        <OfficialReportDialog
          open={showOfficialDialog}
          onOpenChange={setShowOfficialDialog}
          referenceId={referenceId}
          isRegistering={isRegistering}
          handleRegisterOfficial={handleRegisterOfficial}
          canRegisterOfficial={canRegisterOfficial}
        />
      </Dialog>
    </div>
  );
};

export default CerfaGenerationButton;
