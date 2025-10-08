// import EmailConfirmationUI from "@/components/confirmation/EmailConfirmationUI";

// export default function EmailConfirmationPage({
//   params,
// }: {
//   params: { token: string };
// }) {
//   return <EmailConfirmationUI token={params.token} />;
// }

"use client";

import { useRouter } from "next/navigation";

export default function EmailConfirmationPage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="text-blue-500 text-6xl mb-4">ℹ️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Email Confirmation Disabled
          </h2>
          <p className="text-gray-600 mb-6">
            Email confirmation for registration is currently disabled. Your registration is automatically confirmed.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}
