"use client";
import React, { useCallback, useEffect } from "react";
import { Table, Skeleton, Empty } from "antd";
import { useGetDomainsQuery } from "@/hooks/domainApi";
import type { Domain } from "@/hooks/domainApi";
import AddDomainDrawer from "@/components/drawer/AddDomainDrawer";
import { useNotification } from "@/hooks/useNotification";
import { useDomainOperations } from "@/hooks/useDomainOperations";
import { useDomainData } from "@/hooks/useDomainData";
import { getDomainTableColumns } from "./DomainTableColumns";

interface DomainsTableProps {
  searchQuery: string;
  orderBy: string;
}

const DomainsTable = ({ searchQuery, orderBy }: DomainsTableProps): React.ReactElement => {
  const { data: domains, isLoading, error: fetchError } = useGetDomainsQuery();
  const notification = useNotification();
  const {
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
  } = useDomainOperations();

  const filteredAndSortedDomains = useDomainData(domains, searchQuery, orderBy);

  // Handle success and error states
  useEffect(() => {
    if (isCreateSuccess) {
      notification.success("Success", "Domain added successfully");
      handleClose();
    }
  }, [isCreateSuccess, handleClose]);

  useEffect(() => {
    if (isUpdateSuccess) {
      notification.success("Success", "Domain updated successfully");
      handleClose();
    }
  }, [isUpdateSuccess, handleClose]);

  useEffect(() => {
    if (isDeleteSuccess) {
      notification.success("Success", "Domain removed successfully");
    }
  }, [isDeleteSuccess]);

  useEffect(() => {
    if (isCreateError) {
      notification.error("Error", "Failed to add domain");
    }
  }, [isCreateError]);

  useEffect(() => {
    if (isUpdateError) {
      notification.error("Error", "Failed to update domain");
    }
  }, [isUpdateError]);

  useEffect(() => {
    if (isDeleteError) {
      notification.error("Error", "Failed to remove domain");
    }
  }, [isDeleteError]);

  const getMenuItems = useCallback((record: Domain) => [
    {
      key: "verify",
      label: "Verify",
      disabled: record.status === "verified",
      onClick: () => handleVerify(record.id),
    },
    {
      key: "edit",
      label: "Edit",
      onClick: () => handleEdit(record),
    },
    {
      key: "delete",
      label: <span>Delete</span>,
      danger: true,
      onClick: () => handleDelete(record.id),
    },
  ], [handleEdit, handleDelete, handleVerify]);

  const columns = getDomainTableColumns({ getMenuItems });

  if (fetchError) {
    notification.error("Error", "There was an error on loading domains.");
    return <div>Error loading domains</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg">
        <Table
          dataSource={isLoading ? Array(5).fill({}).map((_, index) => ({
            id: `loading-${index}`,
            domain: '',
            status: 'pending',
            isActive: false,
            createdDate: Date.now()
          } as Domain)) : filteredAndSortedDomains}
          columns={columns.map((column) => ({
            ...column,
            render: isLoading
              ? () => <Skeleton.Input active size="small" />
              : column.render,
          }))}
          pagination={false}
          rowClassName={() => "align-middle"}
          rowKey="id"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  searchQuery
                    ? "No domains found matching your search"
                    : "No domains added yet"
                }
              />
            ),
          }}
        />
      </div>
      <AddDomainDrawer
        open={drawerOpen}
        onClose={handleClose}
        initialData={selectedDomain}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        isCreating={isCreating}
        isUpdating={isUpdating}
      />
    </>
  );
};

export default DomainsTable;
