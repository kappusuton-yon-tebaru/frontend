"use client";

export default function Home() {
  function handleLogin() {
    window.location.assign(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/login`
    );
  }

  return (
    <div>
      <button onClick={handleLogin}>Log in with Github</button>
    </div>
  );
}
