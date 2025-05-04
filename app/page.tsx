"use client";
import { useState } from "react";
import ActionBar from "@/components/actionBar";
import DomainsTable from "@/components/table/DomainsTable";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderBy, setOrderBy] = useState("newest");

  return (
    <main className="flex flex-col max-w-[1440px] w-full px-10 gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-[30px]">Domains</h1>
        <ActionBar onSearch={setSearchQuery} onOrderChange={setOrderBy} />
        <div className="mt-6">
          <DomainsTable searchQuery={searchQuery} orderBy={orderBy} />
        </div>
      </div>
    </main>
  );
}
