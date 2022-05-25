import React, { useCallback } from "react";
import { useHistory } from "react-router";
import "./styles/styles.css";

export default function Info({ user, magic, handleChangeNetwork, balance }) {
  const history = useHistory();

  const logout = useCallback(() => {
    magic.user.logout().then(() => {
      history.push("/login");
    });
  }, [history, magic.user]);

  return (
    <>
      <div className="container">
        <p>Current user: {user.email}</p>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="container">
        <p>Network</p>
        <div className="info">
          <select name="network" onChange={e => handleChangeNetwork(e)}>
            <option value="ethereum">Avalanche (Fuji Testnet)</option>
            <option value="matic">Matic (Mumbai Testnet)</option>
          </select>
        </div>
        <p>Public Address</p>
        <div className="info">{user.publicAddress}</div>
        <p>Balance</p>
        <div className="info">
          {balance.toString().substring(0, 6)} {magic.network === "matic" ? "MATIC" : "ETH"}
        </div>
      </div>
    </>
  );
}
