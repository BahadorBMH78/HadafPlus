import React from "react";
import { Drawer, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import DomainForm from "./DomainForm";
import { useCreateDomainMutation, useUpdateDomainMutation } from "@/app/hooks/domainApi";
import { useForm } from "react-hook-form";
import type { Domain } from "@/app/hooks/domainApi";

interface AddDomainDrawerProps {
  open: boolean;
  onClose: () => void;
  initialData?: Domain | null;
  onUpdate?: (data: Partial<Domain>) => Promise<void>;
}

interface FormValues {
  domain: string;
  status: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
}

const AddDomainDrawer: React.FC<AddDomainDrawerProps> = ({ 
  open, 
  onClose, 
  initialData,
  onUpdate 
}) => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      domain: initialData?.domain || '',
      status: initialData?.status || 'pending',
      isActive: initialData?.isActive ?? true
    }
  });
  const [createDomain, { isLoading: isCreating }] = useCreateDomainMutation();
  const [updateDomain, { isLoading: isUpdating }] = useUpdateDomainMutation();

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (initialData && onUpdate) {
        await onUpdate(data);
      } else {
        await createDomain({
          ...data,
          createdDate: Date.now(),
        }).unwrap();
      }
      handleClose();
    } catch (error) {
      console.error('Failed to save domain:', error);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Drawer
      title={
        <div className="flex items-center gap-4">
          <button onClick={handleClose} className="focus:outline-none absolute left-[-60px]">
            <CloseOutlined className="text-2xl !text-white" />
          </button>
          <span className="text-2xl font-semibold">
            {initialData ? 'Edit Domain' : 'Add Domain'}
          </span>
        </div>
      }
      placement="right"
      width={600}
      onClose={handleClose}
      open={open}
      closeIcon={false}
      styles={{
        footer: { padding: 24 }
      }}
      footer={
        <div className="flex justify-end gap-4">
          <Button className="w-[100px]" onClick={handleClose} size="large">
            Cancel
          </Button>
          <Button 
            className="w-[100px]" 
            type="primary" 
            onClick={handleSubmit(onSubmit)} 
            size="large"
            loading={isLoading}
          >
            {initialData ? 'Save' : 'Add'}
          </Button>
        </div>
      }
    >
      <DomainForm control={control} />
    </Drawer>
  );
};

export default AddDomainDrawer; 