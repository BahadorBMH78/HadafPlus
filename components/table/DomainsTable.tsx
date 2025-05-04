"use client";
import { Table, Tag, Dropdown, Button, Skeleton } from "antd";
import { ExclamationCircleOutlined, MoreOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Link from "next/link";
import { useGetDomainsQuery, useUpdateDomainMutation, useDeleteDomainMutation } from "@/app/hooks/domainApi";
import type { Domain } from "@/app/hooks/domainApi";
import AddDomainDrawer from "@/components/drawer/AddDomainDrawer";

interface DomainsTableProps {
  searchQuery: string;
  orderBy: string;
}

const DomainsTable = ({ searchQuery, orderBy }: DomainsTableProps) => {
  const { data: domains, isLoading, error } = useGetDomainsQuery();
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [updateDomain] = useUpdateDomainMutation();
  const [deleteDomain] = useDeleteDomainMutation();

  const filteredAndSortedDomains = React.useMemo(() => {
    if (!domains) return [];

    let filtered = domains;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(domain => 
        domain.domain.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (orderBy) {
      case 'newest':
        return [...filtered].sort((a, b) => b.createdDate - a.createdDate);
      case 'oldest':
        return [...filtered].sort((a, b) => a.createdDate - b.createdDate);
      case 'active':
        return [...filtered].sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));
      case 'inactive':
        return [...filtered].sort((a, b) => (a.isActive ? 1 : 0) - (b.isActive ? 1 : 0));
      default:
        return filtered;
    }
  }, [domains, searchQuery, orderBy]);

  const handleEdit = (domain: Domain) => {
    setSelectedDomain(domain);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setSelectedDomain(null);
    setDrawerOpen(false);
  };

  const handleUpdate = async (data: Partial<Domain>) => {
    if (selectedDomain) {
      try {
        await updateDomain({
          id: selectedDomain.id,
          data
        }).unwrap();
        handleClose();
      } catch (error) {
        console.error('Failed to update domain:', error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDomain(id).unwrap();
    } catch (error) {
      console.error('Failed to delete domain:', error);
    }
  };

  const columns = [
    {
      title: "Domain URL",
      dataIndex: "domain",
      key: "domain",
      render: (text: string, record: Domain) => (
        <span className="flex items-center gap-2">
          <span>
            {record.isActive ? (
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1" />
            ) : (
              <ExclamationCircleOutlined className="!text-red-600" />
            )}
          </span>
          <Link href={text} target="_blank" rel="noopener noreferrer" className="text-black">
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
        <Tag color={active ? "green" : "red"}>
          {active ? "Active" : "Not Active"}
        </Tag>
      ),
    },
    {
      title: "Verification status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "verified" ? "green" : status === "pending" ? "orange" : "red"}>
          {status === "verified" ? "Verified" : status === "pending" ? "Pending" : "Rejected"}
        </Tag>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_: any, record: Domain) => {
        const menuItems = [
          {
            key: "edit",
            label: "Edit",
            onClick: () => handleEdit(record)
          },
          {
            key: "delete",
            label: <span className="text-red-600">Delete</span>,
            danger: true,
            onClick: () => handleDelete(record.id)
          },
        ];
        return (
          <Dropdown
            menu={{
              items: menuItems,
            }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  if (error) return <div>Error loading data</div>;

  return (
    <>
      <div className="bg-white rounded-lg">
        <Table
          dataSource={isLoading ? Array(5).fill({}) : filteredAndSortedDomains}
          columns={columns.map(column => ({
            ...column,
            render: isLoading ? () => <Skeleton.Input active size="small" /> : column.render
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
        onUpdate={handleUpdate}
      />
    </>
  );
};

export default DomainsTable;
