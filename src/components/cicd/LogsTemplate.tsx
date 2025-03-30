"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const mockLogs = Array.from({ length: 100 }).map((_, i) => ({
  id: 100 - i, // Latest logs first
  message: `Log entry #${100 - i}`,
  timestamp: new Date().toISOString(),
}));

export default function LogsTemplate({
  topic,
  description,
  logsUrl,
}: {
  topic: string;
  description: string;
  logsUrl: string;
}) {
  const [logs, setLogs] = useState<typeof mockLogs>([]);
  const [cursor, setCursor] = useState<number | null>(mockLogs.length); // Start from latest log
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const topObserverRef = useRef<HTMLDivElement | null>(null);
  const limit = 10;
  const prevScrollHeight = useRef(0);

  const loadOlderLogs = useCallback(() => {
    if (cursor === null || loading) return;

    setLoading(true);
    prevScrollHeight.current = containerRef.current?.scrollHeight || 0; // Store scroll height before loading

    setTimeout(() => {
      const newCursor = Math.max(cursor - limit, 0);
      const newLogs = mockLogs.slice(newCursor, cursor);
      setLogs((prev) => [...newLogs, ...prev]); // Prepend older logs
      setCursor(newCursor > 0 ? newCursor : null);
      setLoading(false);

      // Maintain scroll position
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop +=
            containerRef.current.scrollHeight - prevScrollHeight.current;
        }
      }, 0);
    }, 500);
  }, [cursor, loading]);

  useEffect(() => {
    setLogs(mockLogs.slice(mockLogs.length - limit)); // Load latest logs initially
    setCursor(mockLogs.length - limit); // Set cursor for older logs
  }, []);

  useEffect(() => {
    setTimeout(() => {
      containerRef.current?.scrollTo(0, containerRef.current.scrollHeight); // Scroll to bottom initially
    }, 100);
  }, []); // Runs only on first load

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && cursor !== null) {
          loadOlderLogs();
        }
      },
      { threshold: 1 }
    );

    if (topObserverRef.current) observer.observe(topObserverRef.current);
    return () => observer.disconnect();
  }, [cursor, loadOlderLogs]);

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
            className="p-2 border-b bg-ci-modal-black hover:bg-ci-modal-blue"
          >
            <p>{log.message}</p>
            <small className="text-gray-500">
              {new Date(log.timestamp).toLocaleString()}
            </small>
          </div>
        ))}
        {loading && <p>Loading older logs...</p>}
      </div>
    </div>
  );
}
