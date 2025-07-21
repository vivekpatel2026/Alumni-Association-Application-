import React from "react";
import { FiUpload } from "react-icons/fi";

const profile = {
  name: "Ricardo Cooper",
  imageUrl:
    "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  coverImageUrl:
    "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  about: `
    <p class='mb-2'>Tincidunt quam neque in cursus viverra orci, dapibus nec tristique. Nullam ut sit dolor consectetur urna, dui cras nec sed.</p>
    <p class='mb-2'>Pulvinar a sed platea rhoncus ac mauris amet. Scelerisque fermentum, cursus felis dui suspendisse velit pharetra.</p>
  `,
  fields: {
    Phone: "(555) 123-4567",
    Email: "ricardocooper@example.com",
    Title: "Senior Front-End Developer",
    Team: "Product Development",
    Location: "San Francisco",
    Sits: "Oasis, 4th floor",
    Salary: "$145,000",
    Birthday: "June 8, 1990",
    "Current Job": "Google - Software Engineer",
    "Previous Jobs": [
      "Meta - Frontend Developer",
      "Amazon - UI/UX Designer",
      "Microsoft - Software Engineer"
    ]
  }
};

export default function UserProfile() {
  return (
    <div className="bg-gray-100 min-h-screen p-6 flex justify-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-48 lg:h-56">
          <img className="h-full w-full object-cover" src={profile.coverImageUrl} alt="Cover" />
          <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:bg-gray-200 transition">
            <FiUpload className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Profile Header */}
        <div className="px-6 sm:px-8 lg:px-10">
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start -mt-12">
            {/* Profile Picture */}
            <div className="relative">
              <img className="h-24 w-24 sm:h-28 sm:w-28 rounded-full ring-4 ring-white" src={profile.imageUrl} alt="Profile" />
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition">
                <FiUpload className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Profile Name & Details */}
            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-500 mt-3">{profile.fields.Title} • {profile.fields.Team}</p>

              {/* Buttons */}
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                <button className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300">
                  20 Profile Views
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                  Follow
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600">
                  Block
                </button>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(profile.fields).map(([field, value]) => (
              <div key={field} className="bg-gray-50 p-3 rounded-lg">
                <dt className="text-xs font-semibold text-gray-600">{field}</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {Array.isArray(value) ? (
                    <ul className="list-disc pl-4 space-y-1">
                      {value.map((job, index) => (
                        <li key={index}>{job}</li>
                      ))}
                    </ul>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </div>

          {/* About Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">About</h2>
            <div className="mt-2 text-sm text-gray-700 space-y-2" dangerouslySetInnerHTML={{ __html: profile.about }} />
          </div>
        </div>
      </div>
    </div>
  );
}
