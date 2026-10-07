export const formatDate = (timestamp?: number) =>
  timestamp
    ? new Intl.DateTimeFormat("en-SE", { dateStyle: "medium" }).format(
        new Date(timestamp * 1000),
      )
    : "—";
