"use client"
import { useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import AddDomainDrawer from "@/components/drawer/AddDomainDrawer";

const { Option } = Select;

interface ActionBarProps {
  onSearch: (value: string) => void;
  onOrderChange: (value: string) => void;
}

const ActionBar = ({ onSearch, onOrderChange }: ActionBarProps) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const handleAdd = (value: string) => {
        setDrawerOpen(false);
    };

    const handleSearch = (value: string) => {
        setSearchValue(value);
        onSearch(value);
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Button size="large" type="primary" onClick={() => setDrawerOpen(true)}>
                    <PlusOutlined className="text-[20px]" />
                    <p>Add Domain</p>
                </Button>
                <div className="bg-white rounded-lg flex items-center">
                    <div className="flex justify-end gap-4">
                        <Select 
                            size="large" 
                            defaultValue="newest" 
                            style={{ width: 300 }}
                            onChange={onOrderChange}
                        >
                            <Option value="newest">Newest First</Option>
                            <Option value="oldest">Oldest First</Option>
                            <Option value="active">Active First</Option>
                            <Option value="inactive">Inactive First</Option>
                        </Select>
                        <div className="w-[300px] relative">
                            <Input 
                                size="large" 
                                placeholder="Search" 
                                className="w-full !rounded-[4px]" 
                                rootClassName="!pl-10" 
                                allowClear 
                                value={searchValue}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <SearchOutlined className="text-[15px] absolute left-4 z-10 top-[50%] mt-[-7.5px]" />
                        </div>
                    </div>
                </div>
            </div>
            <AddDomainDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
    );
};

export default ActionBar;
