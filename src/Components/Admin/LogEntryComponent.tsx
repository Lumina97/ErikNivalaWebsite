import { TLogType } from "../../routes/Admin";

const LogEntryComponent = ({ logItem }: { logItem: TLogType }) => {
  const utcSeconds = logItem.time;
  const date = new Date(0);
  date.setUTCSeconds(utcSeconds);

  return (
    <li
      className={
        logItem.level === 30
          ? "infoLog"
          : logItem.level === 40
          ? "warnLog"
          : "errorLog"
      }
    >
      <div>
        <p>{date.toLocaleTimeString()}</p>
        <p>{logItem.msg}</p>
      </div>
    </li>
  );
};

export default LogEntryComponent;
