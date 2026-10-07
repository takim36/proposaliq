import { ProposalTable } from "@/components/ProposalTable";

const Home = () => (
  <main className="min-h-screen">
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white">
            IQ
          </div>
          <div>
            <div className="text-sm font-semibold">ProposalIQ</div>
            <div className="text-xs text-gray-500">
              Proposal review and comparison
            </div>
          </div>
        </div>
        <div className="mt-8 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
            Review and compare proposals before they go out.
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            ProposalIQ helps your team review existing proposals and understand
            the commercial differences between two proposals.
          </p>
        </div>
      </header>
      <ProposalTable />
      <footer className="mt-10 border-t border-gray-200 py-6 text-xs text-gray-500">
        ProposalIQ is an AI-powered tool. AI recommendations are advisory and
        should be reviewed by a human.
      </footer>
    </div>
  </main>
);

export default Home;
