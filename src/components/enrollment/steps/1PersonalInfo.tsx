"use client";

interface PersonalInfoProps {
  data: {
    first_name: string;
    last_name: string;
  };
  updateData: (newData: any) => void;
  onNext: () => void;
}

export function PersonalInfo({ data, updateData, onNext }: PersonalInfoProps) {
  const isValid = data.first_name.trim() && data.last_name.trim();

  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Step 1: Personal Information</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name *</label>
          <input
            type="text"
            value={data.first_name}
            onChange={(e) => updateData({ first_name: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Last Name *</label>
          <input
            type="text"
            value={data.last_name}
            onChange={(e) => updateData({ last_name: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          disabled={!isValid}
          className="bg-blue-500 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
