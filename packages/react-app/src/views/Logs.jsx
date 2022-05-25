import { Alert, Button, Divider, Input, Tabs, Layout, Card, Menu, Col, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import {} from "../components";
import { useContractReader } from "eth-hooks";
import { utils } from "ethers";
import {
  ApiOutlined,
  QrcodeOutlined,
  FieldBinaryOutlined,
  CompassOutlined,
  FileAddOutlined,
  UpSquareOutlined,
} from "@ant-design/icons";
import { useBalance, useContractLoader, useGasPrice, useOnBlock, useUserProviderAndSigner } from "eth-hooks";
import { Address, Balance } from "../components";

export default function Logs({ address, localProvider, tx, readContracts, writeContracts, contractConfig }) {
  return (
    <div>
      <div
        style={{
          border: "1px solid purple",
          backgroundColor: "white",
          padding: 5,
          width: 650,
          margin: "auto",
          marginTop: 2,
          fontSize: 12,
        }}
      ></div>{" "}
    </div>
  );
}
