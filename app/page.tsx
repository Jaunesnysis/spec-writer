import ChatWindow from "./components/ChatWindow";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-2">Spec Writer Agent</h1>
      <p className="text-gray-400 mb-8">
        Describe a feature → get a full product spec
      </p>
      <ChatWindow />
    </main>
  );
}
