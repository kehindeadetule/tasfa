// "use client";

// import React, { useState, useEffect, Suspense } from "react";
// import { useSearchParams } from "next/navigation";
// import EmailConfirmationUI from "@/components/confirmation/EmailConfirmationUI";

// function ConfirmRegistrationContent() {
//   const searchParams = useSearchParams();
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const tokenParam = searchParams.get("token");
//     setToken(tokenParam);
//   }, [searchParams]);

//   if (!token) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full">
//           <div className="bg-white rounded-lg shadow-xl p-8 text-center">
//             <div className="text-red-500 text-6xl mb-4">❌</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">
//               Invalid Confirmation Link
//             </h2>
//             <p className="text-gray-600 mb-6">
//               No confirmation token found in the URL. Please check your email
//               for the correct confirmation link.
//             </p>
//             <a
//               href="/"
//               className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
//             >
//               Go to Homepage
//             </a>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return <EmailConfirmationUI token={token} />;
// }

// export default function ConfirmRegistrationPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-2">
//               Loading confirmation...
//             </h2>
//             <p className="text-gray-600">
//               Please wait while we process your confirmation link.
//             </p>
//           </div>
//         </div>
//       }
//     >
//       <ConfirmRegistrationContent />
//     </Suspense>
//   );
// }

"use client";

import { useRouter } from "next/navigation";

export default function ConfirmRegistrationPage() {
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
