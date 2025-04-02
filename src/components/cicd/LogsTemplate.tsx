"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type LogEntry = {
  id: string;
  timestamp: string;
  log: string;
};

type LogsResponse = {
  data: LogEntry[];
};

export default function LogsTemplate({
  topic,
  description,
  logsUrl,
}: {
  topic: string;
  description: string;
  logsUrl: string;
}) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const topObserverRef = useRef<HTMLDivElement | null>(null);
  const bottomObserverRef = useRef<HTMLDivElement | null>(null);
  const limit = 10;

  // Function to calculate the distance from the top of the container to the first log item
  const getTopLogOffset = () => {
    if (containerRef.current) {
      const firstLog = containerRef.current.querySelector(
        ".log-item"
      ) as HTMLElement | null;
      if (firstLog) {
        return firstLog.offsetTop;
      }
    }
    return 0;
  };

  // Function to set the scroll position
  const setScrollPosition = (offset: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = offset;
    }
  };

  const fetchLogs = useCallback(
    async (direction: "older" | "newer") => {
      if (loading) return;
      setLoading(true);

      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          direction,
          ...(cursor && { cursor }),
        });

        const response = await fetch(`${logsUrl}?${params}`);
        const { data }: LogsResponse = await response.json();

        if (data.length === 0) {
          setLoading(false);
          return;
        }

        setLogs((prevLogs) => {
          const newLogs = data.filter(
            (log) => !prevLogs.some((l) => l.id === log.id)
          );
          return direction === "older"
            ? [...newLogs, ...prevLogs]
            : [...prevLogs, ...newLogs];
        });

        if (data.length > 0) {
          setCursor(data[data.length - 1].id);
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setLoading(false);
      }
    },
    [cursor, logsUrl, loading]
  );

  useEffect(() => {
    fetchLogs("older"); // Load latest logs initially
  }, []);

  useEffect(() => {
    const topObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchLogs("older");
        }
      },
      { threshold: 1 }
    );

    if (topObserverRef.current) topObserver.observe(topObserverRef.current);
    return () => topObserver.disconnect();
  }, [fetchLogs]);

  useEffect(() => {
    const bottomObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchLogs("newer");
        }
      },
      { threshold: 1 }
    );

    if (bottomObserverRef.current)
      bottomObserver.observe(bottomObserverRef.current);
    return () => bottomObserver.disconnect();
  }, [fetchLogs]);

  useEffect(() => {
    if (containerRef.current && initialLoad) {
      // Use setTimeout to ensure DOM is rendered before scrolling
      setTimeout(() => {
        containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
        setInitialLoad(false); // Set initialLoad to false after scrolling
      }, 100); // Delay it slightly
    }
  }, [logs, initialLoad]);

  return (
    <div className="flex flex-col gap-y-8">
      <h2 className="text-xl font-bold">{topic}</h2>
      {description && (
        <div className="text-base text-ci-modal-grey">{description}</div>
      )}
      <hr className="border-t border-gray-300 col-span-6" />
      <div
        ref={containerRef}
        className="border rounded p-2 h-96 overflow-y-auto bg-ci-modal-black"
      >
        <div ref={topObserverRef} className="h-4" />
        {logs.map((log) => (
          <div
            key={`log-${log.id}`}
            className="p-2 border-b bg-ci-modal-black hover:bg-ci-modal-blue log-item"
          >
            <p>{log.log}</p>
            <small className="text-gray-500">
              {new Date(log.timestamp).toLocaleString()}
            </small>
          </div>
        ))}
        <div ref={bottomObserverRef} className="h-4" />
      </div>
    </div>
  );
}
