import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { KycData } from '@/types/auth';
import { AlertTriangle } from 'lucide-react';

interface ReviewStepProps {
  form: UseFormReturn<KycData>;
  onBack: () => void;
  isSubmitting: boolean;
}

export function ReviewStep({ form, onBack, isSubmitting }: ReviewStepProps) {
  const { watch } = form;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Review & Submit</h2>
          <p className="text-muted-foreground">
            Please review your information before submitting
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-accent/50 rounded-lg p-6">
          <div>
            <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-muted-foreground">Full Name</dt>
                <dd className="text-base">
                  {watch("firstName")} {watch("lastName")}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Date of Birth</dt>
                <dd className="text-base">{watch("dateOfBirth")}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">ID Type</dt>
                <dd className="text-base capitalize">
                  {(watch("idType") || "").replace("_", " ")}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">ID Number</dt>
                <dd className="text-base">{watch("idNumber")}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Uploaded Documents</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-muted-foreground">ID Front</dt>
                <dd className="text-base">{watch("idFrontImage")?.name || "Not uploaded"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">ID Back</dt>
                <dd className="text-base">{watch("idBackImage")?.name || "Not uploaded"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Selfie with ID</dt>
                <dd className="text-base">{watch("selfieImage")?.name || "Not uploaded"}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-800 mb-1">Important Notice</h4>
              <p className="text-sm text-yellow-700">
                By submitting this form, you confirm that:
              </p>
              <ul className="list-disc text-sm text-yellow-700 ml-5 mt-2 space-y-1">
                <li>All provided information is accurate and authentic</li>
                <li>The uploaded documents are valid and unmodified</li>
                <li>You are the rightful owner of these documents</li>
                <li>You understand that false information may result in account termination</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
              Submitting...
            </>
          ) : (
            "Submit Verification"
          )}
        </Button>
      </div>
    </div>
  );
}
