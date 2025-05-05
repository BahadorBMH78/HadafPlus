"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Table, Tag, Dropdown, Button, Skeleton } from "antd";
import { ExclamationCircleOutlined, MoreOutlined } from "@ant-design/icons";
import Link from "next/link";
import {
  useGetDomainsQuery,
  useUpdateDomainMutation,
  useDeleteDomainMutation,
  useCreateDomainMutation,
} from "@/app/hooks/domainApi";
import type { Domain } from "@/app/hooks/domainApi";
import AddDomainDrawer from "@/components/drawer/AddDomainDrawer";
import { useNotification } from "@/app/hooks/useNotification";

interface DomainsTableProps {
  searchQuery: string;
  orderBy: string;
}

const DomainsTable = ({ searchQuery, orderBy }: DomainsTableProps) => {
  const { data: domains, isLoading, error: fetchError } = useGetDomainsQuery();
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [updateDomain, { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError }] = useUpdateDomainMutation();
  const [createDomain, { isLoading: isCreating, isSuccess: isCreateSuccess, isError: isCreateError }] = useCreateDomainMutation();
  const [deleteDomain, { isSuccess: isDeleteSuccess, isError: isDeleteError }] = useDeleteDomainMutation();
  const notification = useNotification();

  // Handle success and error states
  useEffect(() => {
    if (isCreateSuccess) {
      notification.success("Success", "Domain added successfully");
      handleClose();
    }
  }, [isCreateSuccess]);

  useEffect(() => {
    if (isUpdateSuccess) {
      notification.success("Success", "Domain updated successfully");
      handleClose();
    }
  }, [isUpdateSuccess]);

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

  // Filter and sort domains
  const filteredAndSortedDomains = useMemo(() => {
    if (!domains) return [];
    let filtered = domains;
    if (searchQuery) {
      filtered = filtered.filter((domain) =>
        domain.domain.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    switch (orderBy) {
      case "newest":
        return [...filtered].sort((a, b) => b.createdDate - a.createdDate);
      case "oldest":
        return [...filtered].sort((a, b) => a.createdDate - b.createdDate);
      case "active":
        return [...filtered].sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));
      case "inactive":
        return [...filtered].sort((a, b) => (a.isActive ? 1 : 0) - (b.isActive ? 1 : 0));
      default:
        return filtered;
    }
  }, [domains, searchQuery, orderBy]);

  // Handlers
  const handleEdit = useCallback((domain: Domain) => {
    setSelectedDomain(domain);
    setDrawerOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedDomain(null);
    setDrawerOpen(false);
  }, []);

  const handleCreate = useCallback(async (data: Partial<Domain>) => {
    try {
      await createDomain(data as Domain).unwrap();
    } catch (error) {
      console.error("Failed to create domain:", error);
    }
  }, [createDomain]);

  const handleUpdate = useCallback(async (data: Partial<Domain>) => {
    if (!selectedDomain) return;
    try {
      await updateDomain({ id: selectedDomain.id, data }).unwrap();
    } catch (error) {
      console.error("Failed to update domain:", error);
    }
  }, [selectedDomain, updateDomain]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteDomain(id).unwrap();
    } catch (error) {
      console.error("Failed to delete domain:", error);
    }
  }, [deleteDomain]);

  const handleVerify = useCallback(async (id: string) => {
    try {
      await updateDomain({ id, data: { status: "verified" } }).unwrap();
    } catch (error) {
      console.error("Failed to verify domain:", error);
    }
  }, [updateDomain]);

  // Memoized menu items for action column
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
      label: <span className="text-red-600">Delete</span>,
      danger: true,
      onClick: () => handleDelete(record.id),
    },
  ], [handleEdit, handleDelete, handleVerify]);

  // Table columns
  const columns = useMemo(() => [
    {
      title: "Domain URL",
      dataIndex: "domain",
      key: "domain",
      render: (text: string, record: Domain) => (
        <span className="flex items-center gap-2">
          {record.isActive ? (
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1" />
          ) : (
            <ExclamationCircleOutlined className="!text-red-600" />
          )}
          <Link
            href={text}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black"
          >
            {text}
          </Link>
        </span>
      ),
    },
    {
      title: "Active Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>{active ? "Active" : "Not Active"}</Tag>
      ),
    },
    {
      title: "Verification status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "verified"
              ? "green"
              : status === "pending"
              ? "orange"
              : "red"
          }
        >
          {status === "verified"
            ? "Verified"
            : status === "pending"
            ? "Pending"
            : "Rejected"}
        </Tag>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_: any, record: Domain) => (
        <Dropdown
          menu={{ items: getMenuItems(record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ], [getMenuItems]);

  if (fetchError) return notification.error("Error", "There was an error on loading domains.");

  return (
    <>
      <div className="bg-white rounded-lg">
        <Table
          dataSource={isLoading ? Array(5).fill({}) : filteredAndSortedDomains}
          columns={columns.map((column) => ({
            ...column,
            render: isLoading
              ? () => <Skeleton.Input active size="small" />
              : column.render,
          }))}
          pagination={false}
          rowClassName={() => "align-middle"}
          rowKey="id"
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
