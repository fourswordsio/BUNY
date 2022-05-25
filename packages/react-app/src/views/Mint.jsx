import { ImageUpload, FolderUpload } from "react-ipfs-uploader";
import { Alert, Button, Divider, Input, Layout, Card, Menu, Statistic, Row, Col } from "antd";
import React, { useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import { useContractReader } from "eth-hooks";
import { utils } from "ethers";
import { TextLoop } from "react-text-loop-next";
import {
  ApiOutlined,
  QrcodeOutlined,
  FieldBinaryOutlined,
  CompassOutlined,
  FileAddOutlined,
  UpSquareOutlined,
} from "@ant-design/icons";

import { Address, Balance, Events } from "../components";

const { Content, Sider } = Layout;
const { TextArea } = Input;

export default function Mint({ address, localProvider, tx, readContracts, writeContracts }) {
  const [_endpoint, setEndpoint] = useState("");

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
                    <p> POBA: Mint </p>{" "}
                    <Alert
                      banner
                      message={
                        <TextLoop mask>
                          <div> This SmartContracts communicates with merchant api </div>{" "}
                          <div> Input your POBA Tag key # to verify. </div>{" "}
                          <div> Once POBA key is verified your NFT can be minted.</div>{" "}
                        </TextLoop>
                      }
                    />
                    <Divider />
                    <div style={{ margin: 8 }}>
                      <Input
                        onChange={e => {
                          setEndpoint(e.target.value);
                        }}
                      />
                      <Button
                        style={{ marginTop: 8 }}
                        onClick={async () => {
                          /* look how you call setPurpose on your contract: */
                          /* notice how you pass a call back for tx updates too */
                          const result = tx(writeContracts.POBAwoo.RequestLicenseKey(_endpoint), update => {
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
                        Tag Check!
                      </Button>
                    </div>
                    <Divider />
                    <br />
                    <Alert
                      banner
                      message={
                        <TextLoop mask style={{ width: "95%" }}>
                          <div> Check for mistakes.</div> <div> Deploying to AVAX testnet </div>{" "}
                          <div> Have a nice day! =) </div>
                        </TextLoop>
                      }
                    />{" "}
                    <div style={{ backgroundColor: "white" }}>
                      POBA Verifier Contract::
                      <Address
                        address={readContracts && readContracts.POBAwoo ? readContracts.POBAwoo.address : null}
                        fontSize={12}
                      />
                      <Events
                        contracts={readContracts}
                        contractName="POBAwoo"
                        eventName="RequestLicenseKeyFulfilled"
                        localProvider={localProvider}
                        startBlock={1}
                      />
                    </div>
                  </div>{" "}
                  <Divider />
                </div>
              </Col>
            </Row>{" "}
          </div>
        </Content>{" "}
      </Layout>
      <Divider />
    </div>
  );
}
