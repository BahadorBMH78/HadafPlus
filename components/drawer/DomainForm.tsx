"use client"
import { Input, Switch, Select } from "antd";
import { Controller, Control } from "react-hook-form";

interface FormValues {
  domain: string;
  status: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
}

interface DomainFormProps {
  control: Control<FormValues>;
}

const DomainForm = ({ control }: DomainFormProps) => {
  return (
    <form className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Domain URL</label>
        <Controller
          name="domain"
          control={control}
          rules={{ required: 'Domain URL is required' }}
          render={({ field, fieldState: { error } }) => (
            <>
              <Input
                {...field}
                size="large"
                placeholder="Enter domain URL"
                status={error ? 'error' : ''}
              />
              {error && (
                <span className="text-red-500 text-sm">{error.message}</span>
              )}
            </>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Status</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              size="large"
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'verified', label: 'Verified' },
                { value: 'rejected', label: 'Rejected' },
              ]}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Active Status</label>
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <Switch
            className="w-[50px]"
              {...field}
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </form>
  );
};

export default DomainForm; 