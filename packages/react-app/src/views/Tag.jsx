import { ImageUpload, FolderUpload } from "react-ipfs-uploader";
import { Alert, Result, Button, Divider, Input, Tabs, Layout, Card, Menu, Col, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { utils } from "ethers";
import { TextLoop } from "react-text-loop-next";
import {
  ApiOutlined,
  QrcodeOutlined,
  FieldBinaryOutlined,
  CompassOutlined,
  FileAddOutlined,
  UpSquareOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import { Address, Balance, Events, Rutter } from "../components";
import QRCode from "qrcode.react";

const { TabPane } = Tabs;

const { Content, Sider } = Layout;
const { TextArea } = Input;

export default function Tag({
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [qrValue, setQRvalue] = useState("");

  const downloadQRCode = () => {
    // Generate download with use canvas and stream
    const canvas = document.getElementById("qr-gen");
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${qrValue}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div style={{ border: "1px solid purple", width: "100%", marginTop: 5, fontSize: 12 }}>
      <Layout className="layout">
        <Sider>
          <Menu style={{ fontSize: 13 }} theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="/1" icon={<FieldBinaryOutlined />}>
              <Link to="/verify"> Verify </Link>{" "}
            </Menu.Item>
            <Menu.Item key="/2" icon={<UpSquareOutlined />}>
              <Link to="/mint"> Mint </Link>{" "}
            </Menu.Item>
            <Menu.Item key="3" icon={<FileAddOutlined />}>
              <Link to="/create"> Create </Link>{" "}
            </Menu.Item>
            <Menu.Item key="4" icon={<QrcodeOutlined />}>
              <Link to="/tag"> POBA tag </Link>{" "}
            </Menu.Item>

            <Menu.Item key="6" icon={<CompassOutlined />}>
              <Link to="/explore"> Explorer </Link>{" "}
            </Menu.Item>
          </Menu>{" "}
        </Sider>
        <Content style={{ height: "80vh", margin: "24px 16px 0" }}>
          <Row>
            <Col span={24} className="right-col">
              <Card
                title="POBA: Generate POBA Tag"
                extra={<a href="#"> ? </a>}
                style={{
                  width: "100%",
                  maxWidth: 600,

                  margin: "auto",
                  border: "1px solid purple",
                }}
              >
                <Card
                  style={{
                    margin: "auto",
                    border: "1px solid purple",
                  }}
                >
                  <Input
                    placeholder="POBA VRF Serial"
                    onChange={e => {
                      setQRvalue(e.target.value);
                    }}
                    value={qrValue}
                    style={{ marginTop: 8, fontSize: 12 }}
                  />
                  <br></br>
                  <div style={{ padding: 10 }}>
                    <Button type="primary" shape="square" icon={<QrcodeOutlined />} size="small">
                      VRF QR
                    </Button>
                    <br></br>
                    <div className="info">
                      <p></p>{" "}
                    </div>{" "}
                    <br />
                    <Card
                      style={{
                        width: "100%",
                        maxWidth: 250,
                        margin: "auto",
                        border: "1px solid purple",
                      }}
                    >
                      <QRCode id="qr-gen" value={qrValue} size={200} level={"H"} includeMargin={true} />
                    </Card>
                    <br />
                    <p>
                      <Button
                        type="primary"
                        shape="square"
                        icon={<DownloadOutlined />}
                        size="small"
                        onClick={downloadQRCode}
                      >
                        Download QR Code
                      </Button>
                    </p>
                  </div>
                </Card>
              </Card>
            </Col>
          </Row>{" "}
        </Content>
      </Layout>{" "}
      <Divider />
    </div>
  );
}
