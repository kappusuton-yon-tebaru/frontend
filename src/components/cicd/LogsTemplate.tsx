"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AnsiToHtml from "ansi-to-html";
import { getData } from "@/services/baseRequest";

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
  statusCheckUrl,
}: {
  topic: string;
  description: string;
  logsUrl: string;
  statusCheckUrl?: string;
}) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [isLogging, setIsLogging] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const topObserverRef = useRef<HTMLDivElement | null>(null);
  const limit = 10;

  const ansiConverter = new AnsiToHtml();

  const isScrolledToBottom = () => {
    if (containerRef.current) {
      return (
        containerRef.current.scrollHeight - containerRef.current.scrollTop <=
        containerRef.current.clientHeight + 5
      );
    }
    return false;
  };

  const fetchLogs = useCallback(
    async (direction: "older" | "newer") => {
      if (loading) return;
      setLoading(true);

      const previousScrollHeight = containerRef.current?.scrollHeight || 0;
      const wasAtBottom = direction === "newer" && isScrolledToBottom();

      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          direction,
          ...(cursor && { cursor }),
        });

        const { data }: LogsResponse = await getData(`${logsUrl}&${params}`);

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

        if (direction === "older" && containerRef.current) {
          setTimeout(() => {
            const newScrollHeight = containerRef.current!.scrollHeight;
            containerRef.current!.scrollTop +=
              newScrollHeight - previousScrollHeight;
          }, 100);
        }

        if (wasAtBottom && containerRef.current) {
          setTimeout(() => {
            containerRef.current!.scrollTop =
              containerRef.current!.scrollHeight;
          }, 100);
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
    fetchLogs("older");
  }, []);

  useEffect(() => {
    if (logs.length === 0) return;

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
  }, [fetchLogs, logs]);

  useEffect(() => {
    if (isLogging) {
      const intervalId = setInterval(() => {
        fetchLogs("newer");
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [fetchLogs]);

  useEffect(() => {
    if (containerRef.current && initialLoad) {
      setTimeout(() => {
        containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
        setInitialLoad(false);
      }, 100);
    }
  }, [logs, initialLoad]);

  useEffect(() => {
    if (statusCheckUrl) {
      getData(statusCheckUrl)
        .then((data) => {
          console.log("Status check response:", data);
          if (data.job_status === "success") {
            setIsLogging(false);
          }
        })
        .catch((err) => console.error("Status check failed:", err));
    }
  }, [statusCheckUrl]);

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
        {logs.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            No logs available
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={`log-${log.id}`}
              className="p-2 border-b bg-ci-modal-black hover:bg-ci-modal-blue log-item"
            >
              <p
                dangerouslySetInnerHTML={{
                  __html: ansiConverter.toHtml(log.log),
                }}
              />
              <small className="text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
