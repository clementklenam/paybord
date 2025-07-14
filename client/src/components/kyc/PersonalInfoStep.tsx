import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { UseFormReturn } from 'react-hook-form';
import { KycData } from '@/types/auth';
import { useState } from 'react';

interface PersonalInfoStepProps {
  form: UseFormReturn<KycData>;
  onNext: () => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const PersonalInfoStep = ({
  form, onNext, date, setDate
}: PersonalInfoStepProps) => {
  const [open, setOpen] = useState(false);
  const { register, formState: { errors }, setValue } = form;

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please provide your personal details to verify your identity
          </p>
        </div>

        <div className="grid gap-8">
          {/* Name Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name
              </Label>
              <Input
                id="firstName"
                {...register("firstName", { required: "First name is required" })}
                className="h-11 bg-white/80 border-gray-200 hover:border-[#6C2BFB] focus:border-[#6C2BFB] focus:ring-[#6C2BFB] transition-colors"
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name
              </Label>
              <Input
                id="lastName"
                {...register("lastName", { required: "Last name is required" })}
                className="h-11 bg-white/80 border-gray-200 hover:border-[#6C2BFB] focus:border-[#6C2BFB] focus:ring-[#6C2BFB] transition-colors"
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phone"
                {...register("phone", { 
                  required: "Phone number is required",
                  pattern: {
                    value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                    message: "Please enter a valid phone number"
                  }
                })}
                className="h-11 bg-white/80 border-gray-200 hover:border-[#6C2BFB] focus:border-[#6C2BFB] focus:ring-[#6C2BFB] transition-colors"
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
                Date of Birth
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  id="dob"
                  value={date ? format(date, 'PPP') : ''}
                  onClick={() => setOpen(true)}
                  className="h-11 bg-white/80 border-gray-200 hover:border-[#6C2BFB] focus:border-[#6C2BFB] focus:ring-[#6C2BFB] transition-colors cursor-pointer"
                  placeholder="Select your date of birth"
                  readOnly
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => {
                        setDate(date);
                        setOpen(false);
                        if (date) {
                          setValue("dateOfBirth", format(date, "yyyy-MM-dd"));
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-2.5">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Residential Address
            </Label>
            <Input
              id="address"
              {...register("address", { required: "Address is required" })}
              className="h-11 bg-white/80 border-gray-200 hover:border-[#6C2BFB] focus:border-[#6C2BFB] focus:ring-[#6C2BFB] transition-colors"
              placeholder="Enter your full address"
            />
            {errors.address && (
              <p className="text-sm text-red-500 mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* ID Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label htmlFor="idType" className="text-sm font-medium text-gray-700">
                ID Type
              </Label>
              <Select onValueChange={(value) => setValue("idType", value)}>
                <SelectTrigger className="h-11 bg-white/80 border-gray-200 hover:border-[#6C2BFB] focus:border-[#6C2BFB] focus:ring-[#6C2BFB] transition-colors">
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national_id">National ID</SelectItem>
                  <SelectItem value="drivers_license">Driver's License</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="idNumber" className="text-sm font-medium text-gray-700">
                ID Number
              </Label>
              <Input
                id="idNumber"
                {...register("idNumber", { required: "ID number is required" })}
                className="h-11 bg-white/80 border-gray-200 hover:border-[#6C2BFB] focus:border-[#6C2BFB] focus:ring-[#6C2BFB] transition-colors"
                placeholder="Enter your ID number"
              />
              {errors.idNumber && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.idNumber.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button
            type="button"
            onClick={onNext}
            className="h-11 px-8 bg-[#6C2BFB] hover:bg-[#5921c9] text-white font-medium transition-colors"
          >
            Continue to Document Upload
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfoStep;
