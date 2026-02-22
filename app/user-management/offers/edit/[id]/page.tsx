"use client";

import { useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: { id: string };
}) {
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (params.id) {
      fetchSingleOffer();
    }
  }, [params.id]);

  const fetchSingleOffer = async () => {
    const res = await fetch(
      `https://api.bijliwalaaya.in/api/offers/${params.id}`,
      {
        headers: {
          "x-api-token": "super_secure_token",
        },
      }
    );

    const data = await res.json();
    console.log(data);
  };

  return <div>Edit Offer {params.id}</div>;
}