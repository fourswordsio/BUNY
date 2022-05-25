import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://pobatag.com/" target="_blank" rel="noopener noreferrer">
      <PageHeader title="BUNY" subTitle="NFT Launchpad and Exchange." style={{ cursor: "pointer" }} />
    </a>
  );
}
