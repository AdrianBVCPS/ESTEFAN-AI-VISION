export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
      <div className="text-center space-y-6">
        <h1 className="font-display text-4xl font-bold text-navy tracking-tight">
          Estefan AI Vision
        </h1>
        <p className="font-ui text-lg text-text-secondary max-w-md">
          Visualiza tu nuevo look con inteligencia artificial
        </p>
        <div className="w-16 h-1 bg-gold mx-auto rounded-full" />
      </div>
    </main>
  );
}
