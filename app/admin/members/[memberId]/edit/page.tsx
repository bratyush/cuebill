"use client";

import { universalFetcher } from "@/utils/fetches";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditMember() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const router = useRouter();
  const { memberId } = useParams<{ memberId: string }>();

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const data = await universalFetcher(`/api/members/${memberId}`, "GET");
        setName(data.member.name);
        setNumber(data.member.number?.toString() ?? "");
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchMemberData();
  }, [memberId]);

  async function editMemberSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await universalFetcher(`/api/members/${memberId}`, "PATCH", {
        name,
        number: parseInt(number),
      });
      toast.success("Member updated");
      router.push("/admin/members");
    } catch (error) {
      toast.error("There was an error!");
      console.error("Fetch error:", error);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <form onSubmit={editMemberSubmit} className="mx-auto max-w-md">
        <div className="mb-5">
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            className="block w-full rounded-lg border border-gray-300 p-2.5"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="number"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Phone Number
          </label>
          <input
            type="number"
            id="number"
            className="block w-full rounded-lg border border-gray-300 p-2.5"
            required
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
