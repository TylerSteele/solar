import { EnrollmentWizard } from "@/components/enrollment/EnrollmentWizard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Solar Landscape Enrollment
          </h1>
          <p className="text-gray-600 mt-2">
            Join our community solar program in just a few simple steps!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <EnrollmentWizard />
        </div>
      </div>
    </div>
  );
}
