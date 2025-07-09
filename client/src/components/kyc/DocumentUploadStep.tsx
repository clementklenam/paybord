import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { KycData } from '@/types/auth';
import { cn } from '@/lib/utils';

interface DocumentUploadStepProps {
  onNext: () => void;
  onBack: () => void;
  previewUrls: { [key: string]: string };
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>, field: keyof KycData) => void;
  handleRemoveFile: (field: keyof KycData) => void;
}


  onNext,
  onBack,
  previewUrls,
  handleFileChange,
  handleRemoveFile,
}: DocumentUploadStepProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Document Upload</h2>
          <p className="text-muted-foreground">
            Please upload clear photos of your identification documents
          </p>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-4">
            {/* ID Document Upload */}
            <div className="grid gap-2">
              <Label htmlFor="idDocument">ID Document</Label>
              <div className="relative">
                <input
                  type="file"
                  id="idDocument"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, 'idDocument')}
                  className="hidden"
                />
                <div
                  className={cn(
                    "min-h-[200px] rounded-lg border-2 border-dashed p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2",
                    previewUrls.idDocument ? "border-[#6C2BFB] bg-purple-50/50" : "border-gray-300"
                  )}
                  onClick={() => document.getElementById('idDocument')?.click()}
                >
                  {previewUrls.idDocument ? (
                    <>
                      <img
                        src={previewUrls.idDocument}
                        alt="ID Document Preview"
                        className="max-h-[180px] object-contain rounded"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile('idDocument');
                        }}
                        className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-[#6C2BFB]" />
                      <p className="text-sm text-gray-500">
                        Click to upload your ID document
                      </p>
                      <p className="text-xs text-gray-400">
                        Supported formats: JPEG, PNG, PDF
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Proof of Address Upload */}
            <div className="grid gap-2">
              <Label htmlFor="proofOfAddress">Proof of Address</Label>
              <div className="relative">
                <input
                  type="file"
                  id="proofOfAddress"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, 'proofOfAddress')}
                  className="hidden"
                />
                <div
                  className={cn(
                    "min-h-[200px] rounded-lg border-2 border-dashed p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2",
                    previewUrls.proofOfAddress ? "border-[#6C2BFB] bg-purple-50/50" : "border-gray-300"
                  )}
                  onClick={() => document.getElementById('proofOfAddress')?.click()}
                >
                  {previewUrls.proofOfAddress ? (
                    <>
                      <img
                        src={previewUrls.proofOfAddress}
                        alt="Proof of Address Preview"
                        className="max-h-[180px] object-contain rounded"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile('proofOfAddress');
                        }}
                        className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-[#6C2BFB]" />
                      <p className="text-sm text-gray-500">
                        Click to upload proof of address
                      </p>
                      <p className="text-xs text-gray-400">
                        Supported formats: JPEG, PNG, PDF
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="border-[#6C2BFB] text-[#6C2BFB] hover:bg-purple-50"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={onNext}
              className="bg-[#6C2BFB] hover:bg-[#5921c9] text-white"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
