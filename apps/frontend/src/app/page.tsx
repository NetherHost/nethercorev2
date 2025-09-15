import Button from "@/components/Button";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 bg-dots relative">
      <section className="bg-neutral-950/80 backdrop-blur-md rounded-xl px-8 py-10 max-w-sm w-full text-center border border-neutral-800">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-3 text-white font-sora tracking-tight">
            NetherCore
          </h1>
          <p className="text-neutral-400 text-sm">
            Private dashboard for{" "}
            <span className="text-red-500 font-medium">Nether Host</span>
          </p>
        </div>

        <Button
          variant="primary"
          fullWidth
          icon={<i className="fab fa-discord" />}
          className="mb-6"
        >
          Login with Discord
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 font-mono">
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Authorized users only
        </div>
      </section>
    </main>
  );
}
