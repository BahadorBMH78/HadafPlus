import React, { useEffect, useCallback } from "react";
import { Drawer, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import DomainForm from "./DomainForm";
import { useForm } from "react-hook-form";
import type { Domain } from "@/hooks/domainApi";
import { useNotification } from "@/hooks/useNotification";

interface AddDomainDrawerProps {
  open: boolean;
  onClose: () => void;
  initialData?: Domain | null;
  onCreate: (data: Partial<Domain>) => Promise<void>;
  onUpdate: (data: Partial<Domain>) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
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
  onCreate,
  onUpdate,
  isCreating,
  isUpdating
}) => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      domain: '',
      status: 'pending',
      isActive: true
    }
  });
  const notification = useNotification();

  useEffect(() => {
    if (open && initialData) {
      reset({
        domain: initialData.domain,
        status: initialData.status,
        isActive: initialData.isActive
      });
    } else if (open) {
      reset({
        domain: '',
        status: 'pending',
        isActive: true
      });
    }
  }, [open, initialData, reset]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const onSubmit = useCallback(async (data: FormValues) => {
    try {
      if (initialData) {
        await onUpdate(data);
      } else {
        await onCreate({
          ...data,
          createdDate: Date.now(),
        });
      }
    } catch (error) {
      console.error('Failed to save domain:', error);
      notification.error('Error', 'Failed to save domain');
    }
  }, [initialData, onCreate, onUpdate, notification]);

  const handleFormSubmit = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

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
            onClick={handleFormSubmit}
            size="large"
            loading={isCreating || isUpdating}
          >
            {initialData ? 'Edit' : 'Add'}
          </Button>
        </div>
      }
    >
      <DomainForm control={control} />
    </Drawer>
  );
};

export default AddDomainDrawer; 