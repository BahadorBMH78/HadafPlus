"use client"
import { Button, Tag, Dropdown } from 'antd';
import { ExclamationCircleOutlined, MoreOutlined } from '@ant-design/icons';
import Link from 'next/link';
import type { Domain } from '@/hooks/domainApi';
import type { ColumnsType } from 'antd/es/table';

interface DomainTableColumnsProps {
  getMenuItems: (record: Domain) => any[];
}

export const getDomainTableColumns = ({ getMenuItems }: DomainTableColumnsProps): ColumnsType<Domain> => [
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
]; 