import { useState, useCallback } from 'react';
import {
  useUpdateDomainMutation,
  useDeleteDomainMutation,
  useCreateDomainMutation,
  Domain
} from './domainApi';

export const useDomainOperations = () => {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [updateDomain, { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError }] = useUpdateDomainMutation();
  const [createDomain, { isLoading: isCreating, isSuccess: isCreateSuccess, isError: isCreateError }] = useCreateDomainMutation();
  const [deleteDomain, { isSuccess: isDeleteSuccess, isError: isDeleteError }] = useDeleteDomainMutation();

  const handleEdit = useCallback((domain: Domain) => {
    setSelectedDomain(domain);
    setDrawerOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedDomain(null);
    setDrawerOpen(false);
  }, []);

  const handleCreate = useCallback(async (data: Partial<Domain>) => {
    await createDomain(data as Domain).unwrap();
  }, [createDomain]);

  const handleUpdate = useCallback(async (data: Partial<Domain>) => {
    if (!selectedDomain) return;
    await updateDomain({ id: selectedDomain.id, data }).unwrap();
  }, [selectedDomain, updateDomain]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteDomain(id).unwrap();
  }, [deleteDomain]);

  const handleVerify = useCallback(async (id: string) => {
    await updateDomain({ id, data: { status: "verified" } }).unwrap();
  }, [updateDomain]);

  return {
    selectedDomain,
    drawerOpen,
    isUpdating,
    isCreating,
    handleEdit,
    handleClose,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleVerify,
    isUpdateSuccess,
    isCreateSuccess,
    isDeleteSuccess,
    isUpdateError,
    isCreateError,
    isDeleteError
  };
}; 