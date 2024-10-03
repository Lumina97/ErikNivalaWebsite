import React, { useEffect, useState } from "react";
import { apiBasePath } from "../settings";
import LogEntryComponent from "../Components/Admin/LogEntryComponent";

import "../css/admin.css";

export type TLogType = {
  level: number;
  time: number;
  pid: number;
  hostname: string;
  msg: string;
};

const Admin = () => {
  const [logData, setLogData] = useState<TLogType[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(`${apiBasePath}/api/admin/logs`);

    eventSource.onmessage = (event) => {
      if (event.data) {
        setLogData((prevLogData) => [...prevLogData, JSON.parse(event.data)]);
      }
    };

    eventSource.onerror = (error: Event) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    const handleBeforeUnload = () => {
      eventSource.close();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      eventSource.close();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div id="Admin">
      <ul className="m-auto w-full h-12 bg-white">
        {logData
          .filter((item) => item.level === 30)
          .reverse()
          .map((item, index) => {
            return <LogEntryComponent key={index} logItem={item} />;
          })}
      </ul>
    </div>
  );
};

export default Admin;
