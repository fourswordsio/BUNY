import { ImageUpload, FolderUpload } from "react-ipfs-uploader";
import { Alert, Result, Button, Divider, Input, Tabs, Layout, Card, Statistic, Menu, Col, List, Row } from "antd";
import React, { useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { utils } from "ethers";
import { TextLoop } from "react-text-loop-next";
import { bn } from "@ethersproject/bignumber";
import { parseEther, formatEther } from "@ethersproject/units";
import {
  ApiOutlined,
  QrcodeOutlined,
  FieldBinaryOutlined,
  CompassOutlined,
  FileAddOutlined,
  UpSquareOutlined,
} from "@ant-design/icons";
import { Address, Events } from "../components";
import { useContractLoader, useContractReader, useGasPrice, useOnBlock, useUserProviderAndSigner } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";

const { TabPane } = Tabs;
const { Content, Sider } = Layout;
const { TextArea } = Input;

export default function Verify({
  address,
  localProvider,
  tx,
  userSigner,
  implementation,
  CreatedEdition,
  readContracts,
  writeContracts,
  contractConfig
}) {
  const [_endpoint, setEndpoint] = useState("");

  const [license_number, setLicenseNumber] = useState("0");
  const [newPurpose, setNewPurpose] = useState("loading...");

  let counter = 0;

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
               <Menu.Item key="4" icon={<CompassOutlined />}>
              <Link to="/explore"> Explorer </Link>{" "}
            </Menu.Item>
          </Menu>{" "}
        </Sider>
        <Content style={{ height: "90vh", margin: "24px 16px 0" }}>
          <div style={{ width: "100%" }}>
            <Row>
              <Col span={24} className="right-col">
                <div>
                  <div
                    style={{
                      border: "1px solid purple",
                      backgroundColor: "white",
                      padding: 2,
                      width: "100%",
                      maxWidth: 600,
                      margin: "auto",
                      marginTop: 1,
                    }}
                  >
                    <p> Network: Ethereum (testnet) </p>
                    Contracts:
                    <div>Factory: <Address
                      address={readContracts && readContracts.dFactory ? readContracts.dFactory.address : null}
                      fontSize={12}
                    /></div>
                  ERC721: <Address address={readContracts && readContracts.erc721Dynamic ? readContracts.erc721Dynamic.address : null} fontSize={12} />
                  </div>
                  <div>Events: {CreatedEdition} </div>
                  <Divider />
                  <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 24 }}>
                    <div
                      style={{ border: "1px solid #cccccc", padding: 16, width: 300, margin: "auto", marginTop: 64 }}
                    ></div>
                    <p>Verify BUNY Tag</p>
                    <Divider />
                    <div style={{ margin: 8 }}>
                      <Input
                        onChange={e => {
                          setEndpoint(e.target.value);
                        }}
                      />
                      <Button
                        onClick={async () => {
                          const result = tx(writeContracts.POBAwoo.RequestLicenseKey(newPurpose), update => {
                            console.log("📡 Transaction Update:", update);
                            if (update && (update.status === "confirmed" || update.status === 1)) {
                              console.log(" 🍾 Transaction " + update.hash + " finished!");
                              console.log(
                                " ⛽️ " +
                                  update.gasUsed +
                                  "/" +
                                  (update.gasLimit || update.gas) +
                                  " @ " +
                                  parseFloat(update.gasPrice) / 1000000000 +
                                  " gwei",
                              );
                            }
                          });
                          console.log("awaiting metamask/web3 confirm result...", result);
                          console.log(await result);
                        }}
                      >
                        Verify!
                      </Button>
                    </div>
                  </div>
                  <Row gutter={16}>
                    <Col span={12}></Col>
                    <Col span={12}></Col>
                  </Row>
                  <br />
                </div>{" "}
              </Col>
            </Row>{" "}
          </div>
        </Content>{" "}
      </Layout>
      <Divider />
    </div>
  );
}
